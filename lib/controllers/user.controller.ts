import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import UserService from "../modules/services/user.service";
import { auth } from "../middlewares/auth.middleware";


class UserController implements Controller {
    path: string = '/api/user';
    router: Router = Router();
    passwordService: PasswordService = new PasswordService();
    tokenService: TokenService = new TokenService();
    userService: UserService = new UserService();

    constructor() {
        this.initializeRouters();
    }

    private initializeRouters() {
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.delete(`${this.path}/logout/:userId`, auth, this.removeHashSession);
    }

    private removeHashSession = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params

        try {
            const result = await this.tokenService.remove(userId);
            res.status(200).send(result);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
    private authenticate = async (req: Request, res: Response, next: NextFunction) => {
        const { login, password } = req.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                res.status(401).json({ error: 'Unauthorized' });
            }
            await this.passwordService.authorize(user.id, await this.passwordService.hashPassword(password));
            const token = await this.tokenService.create(user);
            res.status(200).json({token: this.tokenService.getToken(token), user_id: user.id});
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
    private createNewOrUpdate = async (req: Request, res: Response, next: NextFunction) => {
        const userData = req.body;
        try {
            const user = await this.userService.createNewOrUpdate(userData);
            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password)
                await this.passwordService.createOrUpdate({
                    userId: user._id,
                    password: hashedPassword
                });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            res.status(400).json({ error: 'Bad request', value: error.message });
        }

    }
}

export default UserController;
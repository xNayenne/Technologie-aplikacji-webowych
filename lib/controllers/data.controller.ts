import { Router, Request, Response, NextFunction, response } from "express";
import Controller from "../interfaces/controller.interface";
import { checkPostCount } from "../middlewares/postCheckCount.middleware";
import DataService from "../modules/services/data.service";
import { IData } from "modules/models/data.model";
import Joi from "joi";

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class DataController implements Controller {
    public path = '/api';
    public router = Router();
    private dataService = new DataService();

    public constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        // // GET
        this.router.get(`${this.path}/posts`, this.getPosts);
        this.router.get(`${this.path}/post/:id`, this.getPostById);

        // // POST
        this.router.post(`${this.path}/post`, this.addPost);
        this.router.post(`${this.path}/post/:num`, checkPostCount, this.getPosts);

        // // DELETE
        this.router.delete(`${this.path}/posts`, this.deleteData)
        this.router.delete(`${this.path}/post/:id`, this.deleteData)
    }

    private getPosts = async (req: Request, res: Response, next: NextFunction) => {
        const { num } = req.params;

        try {
            let allPosts = await this.dataService.getAllPosts();

            if (num !== undefined) {
                allPosts = allPosts.slice(0, parseInt(num));
            }
            res.status(200).json(allPosts);
        } catch (error) {
            console.error('Failed pulling posts:', error);
            res.status(500).send('Internal server error');
        }
    }

    private getPostById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        console.log(id)

        try {
            const post = await this.dataService.query({ _id: id });
            res.status(200).json(post);
        } catch (error) {
            console.error('Failed pulling posts:', error);
            res.status(500).send('Internal server error');
        }
    }

    private addPost = async (req: Request, res: Response, next: NextFunction) => {
        const { title, text, image } = req.body;

        const schema = Joi.object({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string().uri().required()
        });

        try {
            var newPost = await schema.validateAsync({ title, text, image });
        } catch (error) {
            console.error("Failed creatig post: ", error);
            res.status(400).send(`${error}`,);
            return;
        }

        try {            
            await this.dataService.createPost(newPost);
            res.status(200).json({});
        } catch (error) {
            console.error("Failed creatig post: ", error);
            res.status(500).send(`Internal server error: ${error}`,);
        }
    }

    private deleteData = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        try {
            if (id === undefined) {
                await this.dataService.deleteData({});
                res.status(204).json({});
            } else {
                await this.dataService.deleteData({ _id: id })
                res.status(204).json({});
            }
        } catch (error) {
            console.error("Failed delete post: ", error);
            res.status(500).send('Internal server error');
        }
    }
}

export default DataController;
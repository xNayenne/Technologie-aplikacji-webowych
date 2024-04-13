import express from 'express';
import { config } from './config'; 
import Controller from 'interfaces/controller.interface';
import bodyParser from 'body-parser';
import morgan from 'morgan';

export default class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        })
    }

    private initializeMiddlewares() : void {
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));
    }

    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        })
    }
}


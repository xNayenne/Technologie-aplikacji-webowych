import express from 'express';
import { config } from './config';
import Controller from 'interfaces/controller.interface';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose, { mongo } from 'mongoose';
import { logger } from './middlewares/logger.middleware'

export default class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.connectToDatabase();
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        })
    }

    private initializeMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));
        this.app.use(logger);
    }

    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        })
    }

    private async connectToDatabase(): Promise<void> {
        try {
            await mongoose.connect(config.databaseUrl);
            console.log('Connected to database');
        } catch (error) {
            console.error('Failed connecting to database');
        }

        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error: ', error);
        })

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disonnected');
        })

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        })

        process.on('SIGTERM', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

    }
}


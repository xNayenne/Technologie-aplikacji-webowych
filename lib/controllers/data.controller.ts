import { Router, Request, Response, NextFunction } from "express";
import Controller from "interfaces/controller.interface";

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class DataController implements Controller {
    public path = '/api';
    public router = Router();

    public constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // GET
        this.router.get(`${this.path}/posts`, this.getData);
        this.router.get(`${this.path}/post/:id`, this.getOne);

        // POST
        this.router.post(`${this.path}/post`, this.addData);
        this.router.post(`${this.path}/post/:num`, this.getData);

        // DELETE
        this.router.delete(`${this.path}/posts`, this.deleteData)
        this.router.delete(`${this.path}/post/:id`, this.deleteData)
    }

    private getData(request: Request, response: Response, next: NextFunction) {
        const count = parseInt(request.params.num);      

        if (request.params.num != null && count < testArr.length) {
            response.status(200).json(testArr.slice(0, count));
        } else {
            response.status(200).json(testArr);
        }
    }

    private getOne(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if (request.params.id == null) {
            response.status(400).send("Missing id parameter");
        } else if(id > testArr.length) {
            response.status(404).send("Not found");
        } else {
            response.status(200).json(testArr[id]);
        }
        
    }
    
    private addData(request: Request, response: Response, next: NextFunction) {
        const { data } = request.body;
        
        testArr.push(data);
        
        response.status(201).json(testArr);
    }
    
    private deleteData(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
    
        if (request.params.id == null) {
            testArr = [];
            response.status(204).send(testArr);
        } else if (id > testArr.length) {
            response.status(404).send("Not found");
        } else {
            testArr.splice(id, 1)
            response.status(200).json(testArr);
        }
    }
}

export default DataController;
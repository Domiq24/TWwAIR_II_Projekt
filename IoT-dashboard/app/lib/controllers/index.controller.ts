import Controller from '../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import { Server } from 'socket.io';

class IndexController implements Controller {
    public path = '/';
    public router = Router();
    public io: Server;

    constructor(io: Server) {
        this.io = io;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.serveIndex);
    }

    private serveIndex = async (request: Request, response: Response) => {
        response.status(200).send('<p>Test</p>');
    }
}

export default IndexController;
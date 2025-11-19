import { Router } from 'express';
import { Server } from 'socket.io';

interface Controller {
    path: string;
    router: Router;
    io: Server;
}

export default Controller;
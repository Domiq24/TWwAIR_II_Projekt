import Controller from '../interfaces/controller.interface';
import {NextFunction, Request, Response, Router} from 'express';
import { Server } from 'socket.io';
import Joi from "joi";
import { IParkingSpace } from '../modules/models/parking.model';
import ParkingService from '../modules/services/parking.services';
import { spaceName } from '../middlewares/spcaceName.middleware';
import { service } from '../middlewares/service.middleware';
import { auth } from '../middlewares/auth.middleware';
import cors from 'cors';

const options = {
    origin: ['http://localhost:3100', 'http://localhost:5173']
}

class ParkingController implements Controller {
    public path = '/parking';
    public router = Router();
    public io: Server;

    constructor(io: Server, private parkingService: ParkingService) {
        this.io = io;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(cors<Request>(options));
        this.router.get(this.path, auth, this.getAllSpaces);
        this.router.post(`${this.path}/:name`, service, spaceName, this.updateSpace);
        this.router.post(`${this.path}/add/:name`, spaceName, this.addOrUpdateSpace);
        this.router.delete(`${this.path}/:name`, service, spaceName, this.deleteSpace);
    }

    private getAllSpaces = async (request: Request, response: Response) => {
        response.status(200).json(await this.parkingService.getAll());
    }

    private updateSpace = async (request: Request, response: Response) => {
        const { name } = request.params;
        const { air } = request.body;

        const schema = Joi.object({
            air: Joi.object({
                name: Joi.string().regex(/[A-Z]\d{1,2}/).required(),
                state: Joi.string().valid('free', 'occupied', 'emergency').default('free')
            }).required()
        });

        try {
            const validatedData = await schema.validateAsync({air});
            if (validatedData.air.name != name) { throw new Error('\"name\" properties don\'t match in url and body')}
            const data: IParkingSpace = {
                name: validatedData.air.name,
                state: validatedData.air.state
            }

            if(!await this.parkingService.get(data.name))
            {
                console.error(`Space not found: ${data.name}`);
                response.status(404).json({ error: `Space not found: ${data.name}` });
            }

            await this.parkingService.update(data);
            this.io.emit('updateSpace', data);
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    }

    private addOrUpdateSpace = async (request: Request, response: Response) => {
        const { name } = request.params;
        const { air } = request.body;

        const schema = Joi.object({
            air: Joi.object({
                name: Joi.string().pattern(/^[A-Z]\d{1,2}$/).required(),
                state: Joi.string().valid('free', 'occupied', 'emergency').default('free')
            }).required()
        });

        try {
            let validatedData;
            if (air) {
                validatedData = await schema.validateAsync({air});
                if (validatedData.air.name != name) { throw new Error('\"name\" properties don\'t match in url and body')}
            } else {
                validatedData = {air: {name: name, state: 'free'}};
            }
            console.log(validatedData);

            const data: IParkingSpace = {
                name: validatedData.air.name,
                state: validatedData.air.state
            }


            await this.parkingService.createNewOrUpdate(data);
            this.io.emit('updateSpace', data);
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    }

    private deleteSpace = async (request: Request, response: Response) => {
        const { name } = request.params;

        try {
            return await this.parkingService.delete(name);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
        }
    }
}

export default ParkingController;
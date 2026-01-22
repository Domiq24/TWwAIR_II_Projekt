import Controller from '../interfaces/controller.interface';
import { Request, Response, Router } from 'express';
import { Server } from 'socket.io';
import Joi from "joi";
import { IParkingSpace } from '../modules/models/parking.model';
import ParkingService from '../modules/services/parking.services';
import EventService from "../modules/services/event.services";
import { spaceName } from '../middlewares/spcaceName.middleware';
import { service } from '../middlewares/service.middleware';
import { auth } from '../middlewares/auth.middleware';
import cors from 'cors';
import { IEvent } from "../modules/models/event.model";
import Stripe from 'stripe';
import { config } from '../config';


const stripe = new Stripe(config.stripeSecret, {
    apiVersion: '2024-12-18.acacia' as any, 
});

class ParkingController implements Controller {
    public path = '/parking';
    public router = Router();
    public io: Server;

    constructor(io: Server, private parkingService: ParkingService, private eventService: EventService) {
        this.io = io;
        this.initializeRoutes();
    }

   private initializeRoutes() {
        this.router.use(cors<Request>());

       
        this.router.post(`${this.path}/checkout`, this.createCheckoutSession);
        this.router.post(`${this.path}/payment-success`, this.handlePaymentSuccess);
        
       
        this.router.post(`${this.path}/add/:name`, this.addOrUpdateSpace);

       
        this.router.get(this.path, auth, this.getAllSpaces);
        
       
        this.router.post(`${this.path}/:name`, service, spaceName, this.updateSpace);
        
        this.router.delete(`${this.path}/:name`, service, spaceName, this.deleteSpace);
    }

    
    private createCheckoutSession = async (request: Request, response: Response) => {
        const { spotName, price } = request.body;

        if (!spotName) {
             response.status(400).json({ error: 'Spot name is required' });
             return; 
        }

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'pln',
                        product_data: {
                            name: `Opłata za miejsce: ${spotName}`,
                        },
                        unit_amount: (price || 5) * 100, 
                    },
                    quantity: 1,
                }],
                mode: 'payment',
              
                success_url: `http://localhost:5173/success?spotName=${spotName}`,
                cancel_url: `http://localhost:5173/`,
            });

            response.status(200).json({ url: session.url });
        } catch (error: any) {
            console.error('Stripe error:', error);
            response.status(500).json({ error: error.message });
        }
    }

   
    private handlePaymentSuccess = async (request: Request, response: Response) => {
        const { spotName } = request.body;
        console.log(`Payment success for: ${spotName}. Freeing spot...`);

        try {
            // Logika zmiany stanu na 'free'
            const data: IParkingSpace = {
                name: spotName,
                state: 'free'
            };

            await this.parkingService.update(data);
            
            
            this.io.emit('updateSpace', data);

            const event: IEvent = {
                spaceName: data.name,
                state: data.state || 'free'
            };
            this.io.emit('newEvent', await this.eventService.createNewOrUpdate(event));

            response.status(200).json({ success: true, message: `Space ${spotName} is now free` });
        } catch (error: any) {
            console.error(`Payment Success Error: ${error.message}`);
            response.status(500).json({ error: 'Failed to free the space.' });
        }
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

            await this.parkingService.update(data)
            this.io.emit('updateSpace', data);

            const event: IEvent = {
                spaceName: data.name,
                state: data.state || 'free'
            }
            this.io.emit('newEvent', await this.eventService.createNewOrUpdate(event))
            response.status(200).json(data);
        } catch (error: any) {
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
        } catch (error: any) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    }

    private deleteSpace = async (request: Request, response: Response) => {
        const { name } = request.params;

        try {
            return await this.parkingService.delete(name);
        } catch (error: any) {
            console.error(`Validation Error: ${error.message}`);
        }
    }
}

export default ParkingController;
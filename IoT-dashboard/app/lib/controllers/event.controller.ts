import Controller from "../interfaces/controller.interface";
import { Request, Response, Router } from "express";
import {Server, Socket} from "socket.io";
import EventService from "../modules/services/event.services";
import { service } from "../middlewares/service.middleware";
import cors from "cors";
import { IEvent } from "../modules/models/event.model";

interface Data {
    count: number;
    date: Date;
}

class EventController implements Controller {
    public path = '/events';
    public router = Router();
    public io: Server;

    constructor(io: Server, private eventService: EventService) {
        this.io = io;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(cors());
        this.router.get(this.path, service, this.getAllEvents);
        this.router.get(`${this.path}/data`, service, this.getData);
        this.router.get(`${this.path}/data/:group`, service, this.getGroupedData);
        this.router.get(`${this.path}/:name`, service, this.getSpaceEvents);
        this.router.get(`${this.path}/:name/data`, service, this.getSpaceData);
        this.router.get(`${this.path}/:name/data/:group`, service, this.getSpaceGroupedData);
    }

    private getAllEvents = async (request: Request, response: Response) => {
        try {
            response.status(200).send(await this.eventService.getAll());
        } catch (error) {
            response.status(500).send({ error: 'Could not get all events' });
            console.log(error);
        }
    }

    private getData = async (request: Request, response: Response) => {
        try {
            const events = await this.eventService.getAll();
            const data = this.parseData(events);
            response.status(200).send(data);
        } catch (error) {
            response.status(500).send({ error: 'Could not get events' });
        }
    }

    private getGroupedData = async (request: Request, response: Response) => {
        const { group } = request.params;
        try {
            const events = await this.eventService.getAll();
            const data = this.parseGroupedData(events, group);
            if(data)
                response.status(200).send(data);
            else
                response.status(400).send({ error: 'Wrong grouping type' });
        } catch (error) {
            response.status(500).send({ error: 'Could not get events' });
            console.log(error);
        }
    }

    private getSpaceEvents = async (request: Request, response: Response) => {
        const { name } = request.params;

        try {
            const events = await this.eventService.getBySpaceName(name);
            if (!events) return response.status(404).send({ error: 'Space not found' });
            response.status(200).send(events);
        } catch (error) {
            response.status(500).send({ error: 'Could not get events' });
        }
    }

    private getSpaceData = async (request: Request, response: Response) => {
        const { name } = request.params;
        try {
            const events = await this.eventService.getBySpaceName(name);
            if (!events) return response.status(404).send({ error: 'Space not found' });
            const data = this.parseData(events);
            response.status(200).send(data);
        } catch (error) {
            response.status(500).send({ error: 'Could not get events' });
        }
    }

    private getSpaceGroupedData = async (request: Request, response: Response) => {
        const { name, group } = request.params;
        try {
            const events = await this.eventService.getBySpaceName(name);
            if (!events) return response.status(404).send({ error: 'Space not found' });
            const data = this.parseGroupedData(events, group);
            if(data)
                response.status(200).send(data);
            else
                response.status(400).send({ error: 'Wrong grouping type' });
        } catch (error) {
            response.status(500).send({ error: 'Could not get events' });
        }
    }

    private parseData = (events: IEvent[]) => {
        let count = 0;
        const result: Data[] = [];
        for (const event of events) {
            if(event.state === 'occupied') count++;
            else if(event.state === 'free' && count > 0) count--;

            result.push({ count: count, date: event.date });
        }
        return result;
    }

    private parseGroupedData = (events: IEvent[], group: string) => {
        let result: Data[] = [{count: 0, date: events[0].date}];
        let frame = 0;
        for (const event of events) {
            if(event.state !== 'occupied') continue;

            const diff = Math.abs(result[result.length-1].date.getTime() - event.date.getTime());
            switch (group) {
                case "hour":
                    frame = 60 * 60 * 1000;
                    const topBound = new Date(result[result.length-1].date.getTime() + (5 * 60 * 1000));
                    if(diff < frame && event.date >= result[result.length-1].date && event.date < topBound )
                        result[result.length-1]['count']++;
                    else result.push({ count: 1, date: event.date });
                    break;
                case "day":
                    frame = 24 * 60 * 60 * 1000;
                    if(diff < frame && event.date.getHours() === result[result.length-1].date.getHours())
                        result[result.length-1]['count']++;
                    else result.push({ count: 1, date: event.date });
                    break;
                case "week":
                    frame = 7 * 24 * 60 * 60 * 1000;
                    if(diff < frame && event.date.getDay() === result[result.length-1].date.getDay())
                        result[result.length-1]['count']++;
                    else result.push({ count: 1, date: event.date });
                    break;
                case "month":
                    frame = 31 * 24 * 60 * 60 * 1000;
                    if(diff < frame&& event.date.getDate() === result[result.length-1].date.getDate())
                        result[result.length-1]['count']++;
                    else result.push({ count: 1, date: event.date });
                    break;
                case "year":
                    frame = 365 * 24 * 60 * 60 * 1000;
                    if(diff < frame && event.date.getMonth() === result[result.length-1].date.getMonth())
                        result[result.length-1]['count']++;
                    else result.push({ count: 1, date: event.date });
                    break;
                default:
                    return null;
            }
        }
        return result;
    }
}

export default EventController;
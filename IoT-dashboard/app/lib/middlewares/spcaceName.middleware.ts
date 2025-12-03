import { RequestHandler, Request, Response, NextFunction } from 'express';

export const spaceName: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    const { name } = request.params;

    if (name.search(/^[A-Z]\d{1,2}$/) < 0) {
        return response.status(400).send('Brak lub niepoprawna nazwa miejsca!');
    }
    next();
};
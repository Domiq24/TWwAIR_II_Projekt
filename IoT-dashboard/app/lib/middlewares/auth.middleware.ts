import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';

interface User{
    userId: string;
    name: string;
    role: string;
    isActive: boolean;
}

export const auth = (request: Request, response: Response, next: NextFunction) => {
    let token = request.headers['x-access-token'] || request.headers['authorization'];
    if (token && typeof token === 'string') {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        try {
            jwt.verify(token, config.JwtSecret, (err, decoded) => {
                if (err) {
                    return response.status(400).send('Invalid token.');
                }
                const user: User = decoded as User;
                if (!user.isActive) {
                    return response.status(403).send('Access denied.');
                }
                next();
                return;
            });
        } catch (ex) {
            return response.status(400).send('Invalid token.');
        }
    } else {
        return response.status(401).send('Access denied. No token provided.');
    }
};
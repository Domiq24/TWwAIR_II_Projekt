import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface User{
    userId: string;
    name: string;
    role: string;
    isActive: boolean;
}

export const service = (request: Request, response: Response, next: NextFunction) => {
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
                console.log(user.role);
                if (!(user.isActive && ['admin', 'service'].includes(user.role))) {
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
import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import UserService from "../modules/services/user.services";
import PasswordService from "../modules/services/password.services";
import TokenService from "../modules/services/token.services";
import { auth } from "../middlewares/auth.middleware";
import { admin } from "../middlewares/admin.middleware";
import { userAction } from "../middlewares/userAction.middleware";
import cors from "cors";
import {Server} from "socket.io";

class UserController implements Controller {
    public path = '/user';
    public router = Router();
    public io: Server;

    constructor(io: Server, private userService: UserService, private passwordService: PasswordService, private tokenService: TokenService) {
        this.io = io;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(cors<Request>());
        this.router.get(this.path, admin, this.getAllUsers);
        this.router.post(this.path, this.createNewOrUpdate);
        this.router.post(`${this.path}/change-password/admin`, admin, this.changePasswordAdmin);
        this.router.post(`${this.path}/change-password`, auth, this.changePassword);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.delete(`${this.path}/:id`, userAction, this.deleteUser);
        this.router.delete(`${this.path}/logout/:id`, userAction, this.removeHashSession);
    }

    private getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAll();
            response.status(200).send(users);
        } catch (error) {
            console.error(`Get Users Error: ${error.message}`);
            response.status(400).json({error: 'Unable to get users', value: error.message});
        }
    }

    private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
        const userData = request.body;
        try {
            const user = await this.userService.createNewOrUpdate(userData);
            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password)
                await this.passwordService.createOrUpdate({
                    userId: user._id,
                    password: hashedPassword
                });
            }
            response.status(200).json(user);
            this.io.emit('updateUser', user);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }

    };

    private changePassword = async (request: Request, response: Response, next: NextFunction) => {
        const {name, oldPassword, newPassword} = request.body;

        try {
            const user = await this.userService.getByEmailOrName(name);
            if (!user) return response.status(401).json({error: 'Unauthorized'});

            const authToken = await this.passwordService.authorize(user._id, oldPassword);
            if (!authToken) {
                await this.tokenService.remove(user._id);
                return response.status(401).json({error: 'Unauthorized'});
            }

            const hashedPassword = await this.passwordService.hashPassword(newPassword);
            await this.passwordService.createOrUpdate({
                userId: user._id,
                password: hashedPassword
            });
            response.status(200).json("New password has been updated");
        } catch (error) {
            console.error(`Password Change Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }
    }

    private changePasswordAdmin = async (request: Request, response: Response, next: NextFunction) => {
        const {name, newPassword} = request.body;

        try {
            const user = await this.userService.getByEmailOrName(name);
            if (!user) return response.status(401).json({error: 'Unauthorized'});

            const hashedPassword = await this.passwordService.hashPassword(newPassword);
            await this.passwordService.createOrUpdate({
                userId: user._id,
                password: hashedPassword
            });
            response.status(200).json("New password has been updated");
        } catch (error) {
            console.error(`Password Change Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }
    }

    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
        const {name, password} = request.body;

        try {
            const user = await this.userService.getByEmailOrName(name);
            if (!user) return response.status(404).json({error: 'User not found'});
            if (!user.isActive) return response.status(401).json({error: 'User disabled'});

            const result = await this.passwordService.authorize(user.id, password);
            if(!result) return response.status(401).json({error: 'Unauthorized'});

            const token = await this.tokenService.create(user);
            response.status(200).json(this.tokenService.getToken(token));
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
    };

    private deleteUser = async (request: Request, response: Response, next: NextFunction) => {
        const {id} = request.params;

        try {
            await this.userService.deleteById(id);
            await this.passwordService.deleteByUserId(id);
            await this.tokenService.remove(id);
            response.status(200).send(`User ${id} deleted`);
        } catch (error) {
            console.error(`User Deletion Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }
    }

    private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        try {
            const result = await this.tokenService.remove(id);
            response.status(200).send(result);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
    };
}

export default UserController;
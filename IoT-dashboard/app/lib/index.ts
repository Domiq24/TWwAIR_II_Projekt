import App from './app';
import Controller from "./interfaces/controller.interface";
import IndexController from "./controllers/index.controller";
import ParkingController from "./controllers/parking.controller";
import UserController from "./controllers/user.controller";
import ParkingService from "./modules/services/parking.services";
import UserService from "./modules/services/user.services";
import PasswordService from "./modules/services/password.services";
import TokenService from "./modules/services/token.services";

const app: App = new App([]);
const io = app.getIo();

function createControllers(): Controller[] {
    const dataService = new ParkingService();
    const userService = new UserService();
    const passwordService = new PasswordService();
    const tokenService = new TokenService();

    return [
        new ParkingController(io, dataService),
        new UserController(io, userService, passwordService, tokenService),
        new IndexController(io)
    ];
}

const controllers = createControllers();

controllers.forEach((controller) => {
    app.app.use("/", controller.router);
});

app.app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    next();
});

app.listen();
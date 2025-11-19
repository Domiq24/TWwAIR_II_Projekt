import App from './app';
import Controller from "./interfaces/controller.interface";
import IndexController from "./controllers/index.controller";

const app: App = new App([]);
const io = app.getIo();

function createControllers(): Controller[] {

    return [
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
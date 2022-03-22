import express from 'express';
import cors from 'cors';
import routes from './routes';
import Error from  './middlewares/error';


class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(cors());
        this.server.use(Error);
    }

    routes() {
        this.server.use(routes);
    }

}


export default new App().server;

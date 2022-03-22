import { Router } from "express";
import private_route from "./middlewares/auth";
import usersController from './controllers/usersController';
import sessionController from './controllers/sessionController';
import roomsController from "./controllers/roomsController";

const routes = new Router();


routes.get("/", (request, response) => {
    return response.status(200).json({
        message: "Hello World"
    })
})

routes.post("/user/", usersController.create);

routes.post("/login/", sessionController.login);


routes.use(private_route);

routes.get("/user/", usersController.get_score);
routes.delete("/user/", usersController.delete);

// routes.get("/rooms/", roomsController.get_all);




export default routes;
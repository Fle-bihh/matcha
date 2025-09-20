import { Router } from "express";
import { HelloController } from "../controllers/hello.controller.js";
import { UsersController } from "../controllers/users.controller.js";

export const exampleRoutes = Router();

// Instantiate controllers (later will be injected from container)
const helloController = new HelloController();
const usersController = new UsersController();
// Routes
exampleRoutes.get("/hello", helloController.sayHello.bind(helloController));
exampleRoutes.get("/users", usersController.getUsers.bind(usersController));

import { Router } from "express";

import { usersRoutes } from "./users-routes";

const routes = Router()

//Rotas publicas

routes.use("/users", usersRoutes)

export { routes }
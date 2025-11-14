import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionRoutes } from "./sessions-routes";
import { refundsRoutes } from "./refunds-routes";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const routes = Router()

//Rotas publicas
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionRoutes)

//rotas privadas
routes.use(ensureAuthenticated)
routes.use("/refunds", refundsRoutes)

export { routes }
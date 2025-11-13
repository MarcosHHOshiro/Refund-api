import { Router } from "express";

import { SessionsController } from "@/controllers/sessions-controller";

const sessionRoutes = Router()
const sessionsController = new SessionsController()

sessionRoutes.post("/", sessionsController.create)

export { sessionRoutes }
import { Router } from "express";
import multer from "multer";

import uploadConfig from "@/configs/upload"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorizarion";
import { UploadsController } from "@/controllers/uploads-controllers";

const uploadsRoutes = Router()
const uploadsController = new UploadsController()

const upload = multer(uploadConfig.MULTER)

uploadsRoutes.use(verifyUserAuthorization(['employee']))
uploadsRoutes.post("/", upload.single("file"), uploadsController.create)

export { uploadsRoutes }
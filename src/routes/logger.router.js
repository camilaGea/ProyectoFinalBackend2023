import { Router } from "express";
import LoggerController from "../controllers/logger.controllers.js";

const router = Router()
const loggerController = new LoggerController

router.get('/', loggerController.loggerTest)

export default router

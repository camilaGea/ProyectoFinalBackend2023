import { Router } from "express";
import MockingController from "../controllers/mosckin.controllers.js"

const router = Router()
const mockingController = new MockingController()

router.get('/', mockingController.getMocks)

export default router

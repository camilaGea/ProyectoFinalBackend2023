import { Router } from "express";
import UserController from "../controllers/user.controllers.js";
import { uploaderDocument } from "../utils.js";

const router = Router()
const userController = new UserController

router.get('/premium/:id', userController.rollSwitch)
router.post("/:uid/documents",
    uploaderDocument.fields(
        [{name:"identificacion",maxCount:1},
        {name:"domicilio", maxCount:1},
        {name:"estadoDeCuenta", maxCount:1}]), 
    userController.updateUserDocument
)

export default router
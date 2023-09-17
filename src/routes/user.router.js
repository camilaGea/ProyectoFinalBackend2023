import { Router } from "express";
import UserController from "../controllers/user.controllers.js";
import { uploaderDocument } from "../utils.js";
import {adminAccess} from "../middleware/rolVerification.js"

const router = Router()
const userController = new UserController

router.get('/', adminAccess, userController.getUsers) //devuelve datos de los usarios
router.delete('/', adminAccess ,userController.deleteUsers) //debera limpiar usuarios que no hayan tenido conexion en los ultimos 2 dias.
router.post('/:uemail', adminAccess, userController.deleteUser) //debera eliminar usuario
router.get('/premium/:id',adminAccess, userController.rollSwitch) // debra cambiar el roll
router.post('/changeRoll/:uemail', userController.changeRoll) // d
router.post("/:uid/documents",

            uploaderDocument.fields(
                [{name:"identificacion",maxCount:1},
                {name:"domicilio", maxCount:1},
                {name:"estadoDeCuenta", maxCount:1}]), 
            userController.updateUserDocument
)



export default router
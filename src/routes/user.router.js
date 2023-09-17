import { Router } from "express";
import UserController from "../controllers/user.controllers.js";
import { uploaderDocument } from "../utils.js";

const router = Router()
const userController = new UserController

router.get('/', userController.getUsers) //devuelve datos de los usarios
router.delete('/', userController.deleteUsers) //debera limpiar usuarios que no hayan tenido conexion en los ultimos 2 dias.
router.post('/:uemail', userController.deleteUser) //debera eliminar usuario
router.get('/premium/:id', userController.rollSwitch) // debra cambiar el roll
router.post('/changeRoll/:uemail', userController.changeRoll) // d
router.post("/:uid/documents",

            uploaderDocument.fields(
                [{name:"identificacion",maxCount:1},
                {name:"domicilio", maxCount:1},
                {name:"estadoDeCuenta", maxCount:1}]), 
            userController.updateUserDocument
)



export default router
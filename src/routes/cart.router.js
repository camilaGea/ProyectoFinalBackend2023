import { Router } from "express";
import {rollPremiumVerify} from '../middleware/rolVerification.js'
import CartController from "../controllers/cart.controllers.js"

const cartController = new CartController()
const router = Router()

router.get("/:cid",cartController.getCartById ) // ver un cart por id
router.post('/', cartController.postCart ) // crear un carrito 
router.post('/:cid/product/:pid',rollPremiumVerify ,cartController.postProductByCart) // agregar un producto a un carrito
router.put('/:cid', cartController.updateproductByCart) // actualizar el array de los productos del carrito -
router.put('/:cid/products/:pid', cartController.updateCantProductByCart) // actualizao la cantidad de un producto de un carrito 
router.delete('/:cid', cartController.deleteProductsByCart) // elimino todos los productos de un carrito
router.delete('/:cid/products/:pid', cartController.deleteProductByCart) // eliminar un producto de un carrito

router.get('/:cid/purchase', cartController.createTicket) // Finalizar la compra de lo que hay en el carrito y crear el Ticket

export default router
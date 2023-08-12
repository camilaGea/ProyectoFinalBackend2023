import { Router } from 'express';
import ProductsController from '../controllers/products.controllers.js'
import {adminAccess} from '../middleware/rolVerification.js'

const productsController = new ProductsController()
const router = Router();

router.get('/', productsController.getProduct)
router.get('/:id',productsController.getProductsById )
router.post('/',   productsController.postProduct)
router.put('/:id',adminAccess, productsController.putProductById )
router.delete("/:id",adminAccess,  productsController.deleteProductById)

export default router;
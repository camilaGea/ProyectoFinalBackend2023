import { Router } from 'express';
import ProductsController from '../controllers/products.controllers.js'
import {premiumAccess, adminAccess, rollDeleteVerify} from '../middleware/rolVerification.js'

const productsController = new ProductsController()
const router = Router();

router.get('/pp', productsController.getp)
router.get('/', productsController.getProduct)
router.get('/:id',productsController.getProductsById )
router.post('/', premiumAccess, adminAccess, productsController.postProduct)
router.put('/:id', adminAccess, productsController.putProductById )
router.delete("/:id", rollDeleteVerify ,  productsController.deleteProductById)

export default router;
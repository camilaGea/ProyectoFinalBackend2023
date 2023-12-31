import { Router } from "express";
import ProductManagerMongo from "../dao/managerMongo/productMongo.js";
import ViewsController from "../controllers/views.controllers.js"
import { adminAccess } from "../middleware/rolVerification.js"

const viewsController = new ViewsController()

const router = Router();
const pm = new ProductManagerMongo();

router.get('/products', viewsController.productos )
router.get('/carts/:cid', viewsController.cart )
router.get('/', viewsController.login )
router.get('/login', viewsController.login )
router.get('/register', viewsController.register )
router.get('/chat', viewsController.chat )
router.get('/realtimeproducts' , viewsController.realtimeproducts )
router.get('/prueba' , viewsController.admin )
router.get("/forgotpassword",(req,res)=>{
    res.render("forgotPassword");
});

router.get("/resetpassword",(req,res)=>{
    const token = req.query.token;
    res.render("resetPassword",{token});
});

router.get('/users',  viewsController.users)
router.get('/ticket', viewsController.ticket)


export default router;
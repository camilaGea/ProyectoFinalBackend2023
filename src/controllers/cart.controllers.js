import CartsService from "../services/cart.service.js"
import ProductsService from "../services/products.services.js"
import TicketService from "../services/ticketService.js";
import {CustomError} from '../errors/customError.js'
import {EError} from '../errors/enum.js'
import { generateCartErrorParam, generateProductErrorParam} from '../errors/infoError.js'

const ticketManager = new TicketService()
const cartService = new CartsService()
const productsService = new ProductsService()

class CartController {

    getCartById = async (req,res) => {
        try{
            const id = req.params.cid
            if( id.length !== 24 ){
                CustomError.createError({
                    name: "Cart error",
                    cause: generateCartErrorParam(id),
                    message: "Error al acceder a un cart por id",
                    errorCode: EError.INVALID_PARAM
                })
            }
            const cart = await cartService.getAllCartById(id);
            res.send(cart);
        }catch(error){
            res.status(500).send({status:"error", error:error.message})
        }
    }

    postCart = async (req,res)=> {
        try {
            const carrito = await cartService.newCart();
            res.status(201).send({status:"sucess", carrito})
        } catch (error) {
            res.status(500).send({status:"error", error:error.message})
        }    
    }

    
    postProductByCart = async (req,res)=> {
        try{
            const cid =  req.params.cid;
            const pid = req.params.pid;

            if( cid.length !== 24 ){
                CustomError.createError({
                    name: "Cart error",
                    cause: generateCartErrorParam(cid),
                    message: "Error al acceder a un cart por id",
                    errorCode: EError.INVALID_PARAM
                })
            }

            if( pid.length !== 24 ){
                CustomError.createError({
                    name: "Product error",
                    cause: generateProductErrorParam(pid),
                    message: "Error al acceder a un producto por id",
                    errorCode: EError.INVALID_PARAM
                })
            }
            const product = await productsService.getAllProductsById(pid)
            const cart = await cartService.getAllCartById(cid);
     
            if(!cart || cart.status === "error"){
                return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
            }
            if(!product || product.status === "error"){
                return res.status(404).send({status: "error", error: `No existe el producto id ${pid}` })
            }

            const result = await cartService.newProductInCart(cid,pid);
            res.status(200).send({status:"sucess", result})
        }catch(error){
            res.status(500).send({status:"error", error: error.message})
        }
    }

    deleteProductByCart = async (req,res) =>{
        //deberá eliminar del carrito el producto seleccionado.
        try{
            const cid =  req.params.cid;
            const pid = req.params.pid;

            if( cid.length !== 24 ){
                CustomError.createError({
                    name: "Cart error",
                    cause: generateCartErrorParam(cid),
                    message: "Error al acceder a un cart por id",
                    errorCode: EError.INVALID_PARAM
                })
            }
            if( pid.length !== 24 ){
                CustomError.createError({
                    name: "Product error",
                    cause: generateProductErrorParam(pid),
                    message: "Error al acceder a un producto por id",
                    errorCode: EError.INVALID_PARAM
                })
            }

            const product = await productsService.getAllProductsById(pid)
            const cart = await cartService.getAllCartById(cid);
     
            if(!cart || cart.status === "error"){
                return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
            }
            if(!product || product.status === "error"){
                return res.status(404).send({status: "error", error: `No existe el producto id ${pid}` })
            }

            const result = await cartService.deleteProductCart(cid,pid);
            res.status(200).send({status:"sucess", result})
        }catch(error){
            res.status(500).send({status:"error", error:error.message})
        }
    }

    updateproductByCart =  async(req,res)=>{
        // deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
        try{
            const cid = req.params.cid;
            const products = req.body;

            if( cid.length !== 24 ){
                CustomError.createError({
                    name: "Cart error",
                    cause: generateCartErrorParam(cid),
                    message: "Error al acceder a un cart por id",
                    errorCode: EError.INVALID_PARAM
                })
            }

            const cart = await cartService.getAllCartById(cid);
     
            if(!cart || cart.status === "error"){
                return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
            }

            const result = await cartService.updateProductInCart(cid, products)
            res.status(200).send({status:"sucess", result})
        }catch(error){
            res.status(500).send({status:"error", error:error.message})
        }
    
    }

    updateCantProductByCart = async(req,res)=>{
        //deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
        try{
            const cid = req.params.cid
            const pid = req.params.pid
            const {quantity} = req.body
        
            if( cid.length !== 24 ){
                CustomError.createError({
                    name: "Cart error",
                    cause: generateCartErrorParam(cid),
                    message: "Error al acceder a un cart por id",
                    errorCode: EError.INVALID_PARAM
                })
                
            }
            if( pid.length !== 24 ){
                CustomError.createError({
                    name: "Product error",
                    cause: generateProductErrorParam(pid),
                    message: "Error al acceder a un producto por id",
                    errorCode: EError.INVALID_PARAM
                })
                
            }
    
            const product = await productsService.getAllProductsById(pid)
            const cart = await cartService.getAllCartById(cid);
             
            if(!cart ){
                return { status: "error", error: `No existe el carrito con ese id ` }; 
            }
            if(!product ){
                return { status: "error", error: `No existe el producto con ese id ` };
            }

            const result = await cartService.updateCantProductInCart(cid, pid, quantity)
            res.status(200).send({status:"sucess", result})
        }catch(error){
            res.status(500).send({status:"error", error:error.message})
        }
    }

    deleteProductsByCart = async(req,res)=>{
        //deberá eliminar todos los productos del carrito
        try{
            const cid = req.params.cid

            if( cid.length !== 24 ){
                CustomError.createError({
                    name: "Cart error",
                    cause: generateCartErrorParam(cid),
                    message: "Error al acceder a un cart por id",
                    errorCode: EError.INVALID_PARAM
                })
                
            }
            const cart = await cartService.getAllCartById(cid);
             
            if(!cart ){
                return { status: "error", error: `No existe el carrito con ese id ` }; 
            }
            const result = await cartService.deleteProductsCart(cid)
            res.status(200).send({status:"sucess", result})
        }catch(error){
            res.status(500).send({status:"error", error:error.message})
        }
    }
    
    createTicket = async (req, res) => {
        
        try {
            const { cid } = req.params

            if( cid.length !== 24 ){
                CustomError.createError({
                    name: "Cart error",
                    cause: generateCartErrorParam(cid),
                    message: "Error al acceder a un cart por id",
                    errorCode: EError.INVALID_PARAM
                })
                
            }


            let sbProducts = []
            let amount = 0

            const cartProducts = await cartService.getAllCartById(cid) // busco el carrito

            if(!cartProducts) return res.status(401).send({status: 'error', error:  cartProducts}) // veo si esxite

            for (const product of cartProducts.product) { // recorro los productos del array de productos del carrito
                if (product.quantity < product.idProduct.stock) { // si la cant del producto es menor al stock
                    let updateProduct = product.idProduct // asigno a la cariable el producto
                    updateProduct.stock = updateProduct.stock - product.quantity // descuento el stock
                    amount += product.idProduct.price * product.quantity // sumo el precio
                    await productsService.updateProductById(product.idProduct._id, updateProduct) // actualizo el stock del producto
                }else{
                    // si la cantidad es mayor al stock disponible
                    sbProducts.push(product)
                }
            }
            if(sbProducts.length == cartProducts.product.length) return res.status(401).send({status: 'error', error:  sbProducts})
           
            await cartService.updateProductInCart(cid, sbProducts) // actualizo el array producto del carrito
            
            const purchase_datetime = new Date()
            const code = Math.floor(Math.random() * 10000)
            const purchaser = req.session.user.email
            
            let ticket = await ticketManager.createTicket(code, purchase_datetime, amount, purchaser)

            res.send({
                status: "success",
                payload: ticket
            })
           
        } catch (error) {
            res.status(500).send({status:"error", error:error.message})
        }
    }
}

export default CartController
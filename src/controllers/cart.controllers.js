import CartsService from "../services/cart.service.js"
import ProductsService from "../services/products.services.js"
import TicketService from "../services/ticketService.js";

const ticketManager = new TicketService()
const cartService = new CartsService()
const productsService = new ProductsService()

class CartController {
    getCartById = async (req,res) => {
        try{
            const id = req.params.cid
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
         
         const product = await productsService.getAllProductsById(pid)
         const cart = await cartService.getAllCartById(cid);
     
         if(!cart || cart.status === "error"){
             return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
         }
         if(!product || product.status === "error"){
             return res.status(404).send({status: "error", error: `No existe el producto id ${pid}` })
         }
     
         const result = await cartService.newProductInCart(cid,pid);
         console.log(result)
         res.status(200).send({status:"sucess", result})
     
        }catch (error) {
         res.status(500).send({status:"error", error: "Ha ocurrido un error al agrgar el carrito"})
        }
    }

    deleteProductByCart = async (req,res) =>{
        //deberá eliminar del carrito el producto seleccionado.
        try{
            const cid =  req.params.cid;
            const pid = req.params.pid;
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
    
            const cart = await cartService.getAllCartById(cid);
            if(!cart || cart.status === "error"){
                return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
            }
    
            const result = await cartService.updateProductInCartByCant(cid, products)
            res.status(200).send({status:"sucess", result})
    
        }catch(error){
            res.status(500).send({status:"error", error:error.message})
        }
    
    }

    updateCantProductByCart = async(req,res)=>{
        //deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
        const cid = req.params.cid
        const pid = req.params.pid
        //const qty = req.body
        const {quantity} = req.body
    
        const product = await productsService.getAllProducts(pid)
        const cart = await cartService.getAllCartById(cid);
    
        if(!cart || cart.status === "error"){
            return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
        }
        if(!product || product.status === "error"){
            return res.status(404).send({status: "error", error: `No existe el producto id ${pid}` })
        }
    
        console.log(quantity)
    
        const result = await cartService.updateCantProductInCart(cid, pid, quantity)
        res.status(200).send({status:"sucess", result})
    
    }

    deleteProductByCart = async(req,res)=>{
        //deberá eliminar todos los productos del carrito
        const cid = req.params.cid
        const cart = await cartService.getAllCartById(cid);
    
        if(!cart || cart.status === "error"){
            return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
        }
    
        const result = await cartService.deleteProductCart(cid)
        res.status(200).send({status:"sucess", result})
    }
    
    createTicket = async (req, res) => {
        const { cid } = req.params
        try {
            console.log('USUARIO'+ JSON.stringify(req.session.user))
            let sbProducts = []
            let amount = 0

            const cartProducts = await cartService.getAllCartById(cid) // busco el carrito

            if(!cartProducts) return res.status(401).send({status: 'error', error:  cartProducts}) // veo si esxite

            for (const product of cartProducts.product) { // recorro los productos del array de productos del carrito
                console.log('STOCK PRODUCTO' +  product.idProduct.stock)
                console.log('CANTIDAD PRODUCTO' +  product.quantity)

                if (product.quantity < product.idProduct.stock) { // si la cant del producto es menor al stock
                    let updateProduct = product.idProduct // asigno a la cariable el producto
                    updateProduct.stock = updateProduct.stock - product.quantity // descuento el stock
                    amount += product.idProduct.price * product.quantity // sumo el precio
                    console.log('PRECIO'+ amount)
                    console.log('updateProduct: ', updateProduct)
                    await productsService.updateProductById(product.idProduct._id, updateProduct) // actualizo el stock del producto
                }else{
                    // si la cantidad es mayor al stock disponible
                    sbProducts.push(product)
                }
            }
            if(sbProducts.length == cartProducts.product.length) return res.status(401).send({status: 'error', error:  sbProducts})
           
            await cartService.updateProductInCartByCant(cid, sbProducts) // actualizo el array producto del carrito
            console.log("sbProducts", sbProducts);
            let purchase_datetime = new Date()
            let code = Math.floor(Math.random() * 10000)
            let purchaser = req.session.user.email
            
            console.log(code, amount, purchaser, purchase_datetime);

            let ticket = await ticketManager.createTicket(code, purchase_datetime, amount, purchaser)

            res.send({
                status: "success",
                payload: ticket
            })
           
        } catch (error) {
            console.log(error)
        }
    }
}

export default CartController
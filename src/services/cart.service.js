import CartMongo from '../dao/managerMongo/cartMongo.js'
import CartDTO from '../dao/DTOs/cart.dto.js'

export const carts = new CartMongo()

class CartsService{

    getAllCartById  = async (id) => {
        const cart = await carts.getCartById(id);
        return cart
    }

    newCart = async () => {
        const cart = new CartDTO();
        const result = await carts.addCart(cart)
        return result
    }

    newProductInCart = async (cid, pid) => {
        const result = await carts.addProductInCart(cid,pid);
        console.log(result)
        return result
    }

    deleteProductCart = async (cid, pid) => {
        const result = await carts.deleteProductInCart(cid, pid);
        return result 
    }

    
    updateProductInCartByCant = async (cid, products) => {
        const result = await carts.updateProductInCart(cid, products)
        return result
    }

    updateCantProductInCart = async (cid, pid, quantity) => {
        const result = await carts.updateQtyProductInCart(cid,pid, quantity)
        return result
    }
    
    deleteProductsCart = async (cid) => {
        const result = await carts.deleteProductInCart(cid)
        return result
    }

}

export default CartsService
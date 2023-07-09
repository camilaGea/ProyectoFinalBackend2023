import ProductManagerMongo from "../dao/managerMongo/productMongo.js";
import {carts} from "./cart.service.js"

const product = new ProductManagerMongo()

class ViewsServices{

    getRealTimeProducts = async (limit,page, category, disp, sort) => {
        const products = await product.getP()
        return products
    }

    getCarts = async (id) => {
        let cart = await carts.getCartById(id)
        return cart
    }

    getAllProducts = async (limit, page, category, disp, sort) => {
        const products = await product.getProducts(limit, page, category, disp,sort)
        return products
    }

}

export default ViewsServices
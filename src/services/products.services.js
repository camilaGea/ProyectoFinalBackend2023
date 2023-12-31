import ProductManagerMongo from '../dao/managerMongo/productMongo.js'
import ProductoDTO from '../dao/DTOs/products.dto.js'
const productManager = new ProductManagerMongo()

class ProductsServices {
    getp = async () => {
        let product = await productManager.getP()
        return product
    }
    getAllProducts = async (limit,page,category,disp,sort) =>{
        let products = await productManager.getProducts(limit,page,category,disp,sort)
        return products
    }
    getAllProductsById = async (id) => {
        const product = await productManager.getProductsId(id)
        return product
    }
    newProduct = async (  title, description, price, thumbnail, code, stock, category, status, owner) =>{
        const product = new ProductoDTO({title, description, price, thumbnail, code, stock, category, status, owner})
       
        const result = await productManager.addProduct(product);
       
        return result
    }
    updateProductById = async (id, body) => {
        const product = await productManager.updateProduct(id, body)
        return product
    }
    deleteProduct = async (id) => {
        const product = await productManager.deleteProduct(id)
        return product
    }
}

export default ProductsServices
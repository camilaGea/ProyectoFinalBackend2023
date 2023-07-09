import ProductManagerMongo from '../dao/managerMongo/productMongo.js'
import ProductoDTO from '../dao/DTOs/products.dto.js'
const productManager = new ProductManagerMongo()



class ProductsServices {
    
    getAllProducts = async (limit,page,category,disp,sort) =>{
        let products = await productManager.getProducts(limit,page,category,disp,sort)
        return products
    }

    getAllProductsById = async (id) => {
        const product = await productManager.getProductsId(id)
        return product
    }

    newProduct = async (title, description, price, thumbnail, code, stock, category, status) =>{

        if(status === undefined){ status = true}

        const product = new ProductoDTO({title, description, price, thumbnail, code, stock, category, status})

        console.log('NEWPRODUCT' + JSON.stringify(product))

        const result = await productManager.addProduct(product);
        console.log('NEWPRODUCT 2' + JSON.stringify(result))
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
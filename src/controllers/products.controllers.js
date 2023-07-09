import ProductsServices from '../services/products.services.js'

const productsService = new ProductsServices()

class ProductsController {
    getProduct = async (req,res) =>{
        try{
            let { limit,page = 1,category,disp,sort } = req.query;
            let products = await productsService.getAllProducts(limit,page,category,disp,sort);
            res.send({status: "Sucess", products})
        }catch (error){
            res.status(500).send({status:"error", error:error.message})
        }
    }
    getProductsById = async (req,res)=>{
        try{
            const id = req.params.id;
            console.log( id)
            const produc = await productsService.getAllProductsById(id);
            res.send({mensaje:"Producto id",products: produc})
        } catch (error) {
            res.status(500).send({status:"error", error:error.message})
        }  
    }

    postProduct =  async (req,res)=> {
        try{
            const {title, description, price, thumbnail, code, stock, category, status} = req.body
            
            const producto = await productsService.newProduct(title,description,price,thumbnail,code,stock, category, status)
            
            console.log('Producto 1' , JSON.stringify(producto))
            if (producto.status === "error") {
                return res.status(400).send({
                    status: "error",
                    error: producto,
                });
            }

            //console.log('producto 2 ' + JSON.stringify(producto))
            return ({status: 'Success', producto})    
        }catch (error){
            res.status(500).send({status:"error", error:error.message})
        }
    }

    putProductById = async (req,res)=> {
        try{
            const { body } = req;
            const { id } = req.params;
            const producto = await productsService.updateProductById(id, body);
            res.status(200).send({mensaje: "Producto actualizado",producto})
    
        }catch (error){
            res.status(500).send({status:"error", error:error.message})
        }
    }

    deleteProductById = async (req, res) => {
        try {
            const id = req.params.id
            const producto = await productsService.deleteProduct(id)
            console.log (producto)
            if (producto){
                return  producto
            }
        } catch (error) {
            return ({ status: "error", error: error.message })
        }  
    }
    
}

export default ProductsController
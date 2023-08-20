import ProductsServices from '../services/products.services.js'
import {CustomError} from '../errors/customError.js'
import {EError} from '../errors/enum.js'
import {generateProductErrorInfo, generateProductErrorParam} from '../errors/infoError.js'

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

            if( id.length !== 24 ){
                CustomError.createError({
                    name: "Product error",
                    cause: generateProductErrorParam(id),
                    message: "Error al acceder a un producto por id",
                    errorCode: EError.INVALID_PARAM
                })
            }
            const produc = await productsService.getAllProductsById(id);
            
            res.send({mensaje:"Producto id",products: produc})
        } catch (error) {
            res.status(500).send({status:"error", error:error.message})
        }  
    }

    postProduct =  async (req,res)=> {
        try{
            let {title, description, price, thumbnail, code, stock, category, status} = req.body
            if(status === undefined){ status = false}

            if(!title || !description || !price || !code || !stock || !category){
                CustomError.createError({
                    name: "Product error",
                    cause: generateProductErrorInfo(req.body),
                    message: "Error al crear un Producto",
                    errorCode: EError.INVALID_JSON
                })
            }
            let user = req.session.passport.user
            
            let producto = await productsService.newProduct(user , title,description,price,thumbnail,code,stock, category, status)
            if (producto.status === "error") {
                req.logger.error('error en productService ')
                return res.status(400).send({producto});
            }
            res.send({status: 'Success', producto})    
        }catch (error){
            res.status(500).send({status:"error 500", error:error.message})
        }
    }

    putProductById = async (req,res)=> {
        try{
            const { body } = req;
            const { id } = req.params;

            if( id.length !== 24 ){
                CustomError.createError({
                    name: "Product error",
                    cause: generateProductErrorParam(id),
                    message: "Error al acceder a un producto por id",
                    errorCode: EError.INVALID_PARAM
                })
            }

            const producto = await productsService.updateProductById(id, body);
            if(producto.status === "error"){
                return res.status(400).send({producto});
            }
            res.status(200).send({mensaje: "Producto actualizado",producto})
    
        }catch (error){
            res.status(500).send({status:"error", error:error.message})
        }
    }

    deleteProductById = async (req, res) => {
        try {
            const id = req.params.id

            if( id.length !== 24 ){
                CustomError.createError({
                    name: "Product error",
                    cause: generateProductErrorParam(id),
                    message: "Error al acceder a un producto por id",
                    errorCode: EError.INVALID_PARAM
                })
            }

            const producto = await productsService.deleteProduct(id)

            if (producto.status === "error") {
                req.logger.error('error eliminar en product services')
                return res.status(400).send({producto});
            }

            return res.status(200).send({menssage:"paso", producto});
        } catch (error) {
            res.status(500).send({error:error.message})
        }  
    }
    
}

export default ProductsController
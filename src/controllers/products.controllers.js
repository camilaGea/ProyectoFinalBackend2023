import ProductsServices from '../services/products.services.js'
import {CustomError} from '../errors/customError.js'
import {EError} from '../errors/enum.js'
import {generateProductErrorInfo, generateProductErrorParam} from '../errors/infoError.js'

const productsService = new ProductsServices()

class ProductsController {
    getp = async (req,res) => {
        try{
            let product = await productsService.getp()
            res.send({status: "sucess", product})
        }catch (error){
            res.status(500)
        }
    }
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
            let {title, description, price, thumbnail, code, stock, category, status, owner} = req.body

            if(status === undefined){ status = false}

            if(!title || !description || !price || !code || !stock || !category){
                CustomError.createError({
                    name: "Product error",
                    cause: generateProductErrorInfo(req.body),
                    message: "Error al crear un Producto",
                    errorCode: EError.INVALID_JSON
                })
            }
            
            let producto = await productsService.newProduct( title,description,price,thumbnail,code,stock, category, status, owner)
            
            if (producto.status === "error") {
                req.logger.error('error en productService ')
                return res.status(400).send({producto});
            }
            
            res.send({status: 'Success', producto})    
        
        }catch (error){
            res.status(500).send({status:"error", error:error.message})
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

            const productById = await productsService.getAllProductsById(pid);

            if (productById.owner == req.session.email || req.session?.admin == true) {
                
                await productsService.deleteProduct(id)
                let user = await usersService.getUser(productById.owner)

                if (user.roll === 'premium') {

                    const transport = createTransport({
                        service: 'gmail',
                        port: 578,
                        auth: {
                            user: config.adminEmail,
                            pass: config.adminPass
                        }
                    })

                    await transport.sendMail({
                        from:'Servicio de Node',
                        to: user.email,
                        subject: 'Su Producto fue eliminado',
                        html: `
                        <div>
                            <h1>Su producto ${productById.title} fue eliminado</h1>
                        </div>`
                    })
                }
            }


            i//f (producto.status === "error") {
            //    req.logger.error('error eliminar en product services')
            //    return res.status(400).send({producto});
            //}

            return res.status(200).send({menssage:"paso", producto});
        } catch (error) {
            res.status(500).send({error:error.message})
        }  
    }
    
}

export default ProductsController
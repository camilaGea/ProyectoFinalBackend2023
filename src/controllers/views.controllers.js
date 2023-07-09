import ViewsServices from '../services/views.services.js'

const viewsServices = new ViewsServices()

class ViewsController{
    chat = async (req,res)=>{res.render('chat', {});}
    register = async (req,res)=>{res.render('register')}
    login = async (req,res)=>{res.render('login')}


    realtimeproducts = async (req,res) => {
        let user = req.session.user
        const productos = await viewsServices.getRealTimeProducts()
        res.render("realTimeProducts", {productos, user})
    }

    cart = async (req,res) =>{
        //para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito. 
        let id = req.params.cid;
        let cart = await viewsServices.getCarts(id)
        res.render('cart', {cart});
    }

    productos =  async (req,res) =>{
        //para visualizar todos los productos con su respectiva paginación.
        let user = req.session.user;
        let { limit,page = 1,category,disp,sort } = req.query;
        const productos = await viewsServices.getAllProducts(limit,page,category,disp,sort);
        res.render('products', {productos ,user});
    }

    admin =  async (req,res) =>{
        //para visualizar todos los productos con su respectiva paginación.
        let user = req.session.user;
        const productos = await viewsServices.getRealTimeProducts()
        res.render('prueba', {productos ,user});
    }
}

export default ViewsController
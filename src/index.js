import express from "express";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import session from 'express-session';
import passport from "passport";
import __dirname from './utils.js';
import MongoStore from 'connect-mongo';

//IMPORTACIONES MIAS
import viewsRouter from './routes/views.router.js';
import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import mockingRouter from "./routes/mosckin.router.js"
import loggerTest from "./routes/logger.router.js"
import usersRouter from "./routes/user.router.js"
import ProductManagerMongo from "./dao/managerMongo/productMongo.js";
import MenssageMongo from "./dao/managerMongo/menssageMongo.js";
import mongoose from "mongoose";
import initializePassport from "./config/passport.config.js";
import {config} from './config/config.js'
import {errorHandler} from './middleware/errorHandle.js'
import { addLogger } from './utils.js'
import { getLogger } from "./utils.js";
import ProductsController from "./controllers/products.controllers.js"

import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express';

const productsC = new ProductsController()
const pm = new ProductManagerMongo();
const ms = new MenssageMongo();

const PORT = config.server.port;
const MONGO = config.mongo.url
const SECRET = config.session.secret

const app = express();
app.use(addLogger)

const logg = getLogger()
const server = app.listen(PORT, () =>{ logg.info('servidor funcionando en e puerto ' + PORT)});

app.use(express.json()); // entiende los datos que me envian
app.use(express.urlencoded({extended:true}));

app.use(session({
    store: new MongoStore({ mongoUrl: MONGO, ttl:3600}),
    secret:SECRET,
    resave:false,
    saveUninitialized:false
}))

initializePassport(),
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de Proyecto CoderHouse Comision-51185',
            description: 'Proyecto desarrollado por Camila'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use('/', viewsRouter);
app.use('/api/users', usersRouter)
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter)
app.use('/mockingproducts', mockingRouter)
app.use('/loggerTest', loggerTest)

app.use(errorHandler)

const io = new Server(server)

io.on('connection',  socket =>{
    logg.info('Usuario conectado')

    //agregar producto
    socket.on("newProduct", async (data) => {
        let product = await pm.addProduct(data);
        if(product.status === 'error'){
            io.emit("productAdd", { status: "error", message: 'No se pudo agregar el producto' }); // Envía un mensaje de error al cliente
        }
        const dataActualizada = await pm.getP();
        io.emit("productAdd", { status: "success", data: dataActualizada }); // Envía éxito y los datos actualizados
    });
    
    
    //eliminar Producto
    socket.on("productDelete", async (pid) =>{ //escucho lo que me manda el cliente
        let productid = await pm.deleteProduct(pid); //elimino el producto con el id enviado desde el cliente
        if(productid.status === "error"){
            io.emit("newList", { status: "error", message: 'No se pudo eliminar el producto ' })
        }
        
        let dataActualizada = await pm.getP(); // traigo los productos actualizados
        return io.emit("newList", {status: "succes", data: dataActualizada}); // le mando los productos sin el eliminado

    }) 

    //chat
    
    socket.on("message", async(data)  => {
        const NewMessage = await ms.addMenssage(data); 
        const messages = await ms.getMenssage();
        io.emit("messageLogs", messages)
    })

    socket.on("authenticated", data =>{
        socket.broadcast.emit("newUserConnected", data) //el broadcast envia el mesaje a todos los usuarios conectados menos a si mismo
    })
    
})

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO);
        logg.info("Conexion con DB correcta")
    }catch (error){
        logg.error(`Fallo al conectar con DB. Error: ${error}`)
    }
}

connectDB();
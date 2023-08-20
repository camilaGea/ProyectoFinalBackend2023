import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
import bcrypt from 'bcrypt';
import { Faker, en } from '@faker-js/faker'
import winston from 'winston'
import {config} from './config/config.js'
import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';
import multer from 'multer';


//LOGER
let logger;

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

// Configuración del logger para el entorno de desarrollo
const developmentLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console({ level: 'debug' })
    ]
});
  
// Configuración del logger para el entorno de producción
const productionLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: './logs/errors.log', level: 'error' })
    ]
});

if (config.entorno.environment === 'development') {
  logger = developmentLogger;
} else {
  logger = productionLogger;
}

export function addLogger(req, res, next){
    req.logger = logger
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

export function getLogger() {
    return logger;
}


//FAKER
export const customFaker = new Faker({ locale: [en]})

const { commerce,datatype, image, database } = customFaker;

export const generateProduct = ()=>{
    return{
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        code: datatype.number(),
        price: commerce.price(),
        status: datatype.boolean(0.8),
        stock: datatype.number(),
        category: commerce.department(),
        thumbnail: image.url()
    }
}

//PASSWORD HASH
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//JWT

export const generateToken = (email) => {
    const token = jwt.sign({email}, config.gmail.adminEmail, {expiresIn: '1h'})
    return token
}

export const verifyEmailToken = (token) => {
    try{
        const info = jwt.verify(token, config.gmail.adminEmail)
        return info.email
    }catch(error){
        return null
    }
}


//email

export const transport = createTransport ({
    service: 'gmail',
    port:578,
    auth: {
        user: config.gmail.adminEmail,
        pass: config.gmail.adminPass
    },
    secure: false,
    tls: {
        rejectUnauthorizes: false
    }
})

//MULTER

/////////////////////////////////////////////////////////////////////////
//configuracion para guardar imagenes de usuarios

const validFields = (body) => {
    const {nombre, email, password} = body;
    if(!nombre || !email || !password){
        return false;
    }else{
        return true;
    }
};

//filtro para validar los campos de cargar la imagen
const multerFilterProfile = (req,file,cb)=>{
    const isValid = validFields(req.body);
    if(isValid){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const profileStorage = multer.diskStorage({
    //donde guardo los archivos
    destination: function(req,file,cb) {
      cb(null,path.join(__dirname,"/multer/users/imagenes"))  
    },
    //el nombre del archivo que estamos guardando
    filename: function (req,file,cb) {
        cb(null,`${req.body.email}-perfil-${file.originalname}`)
    }
})

//Creamos el UPLOADER de multer IMAGENES DE USUARIOS
export const uploaderProfile = multer({storage: profileStorage, fileFilter:multerFilterProfile  })


///////////////////////////////////////////////////////////////////////////////////////


//Configuracion para guardar documentos de los usuarios

const documentStorage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"/multer/users/documents"));
    },
    filename: function(req,file,cb) {
        cb(null,`${req.user.email}-document-${file.originalname}`);
    }
})

//creamos el UPLOADER DOCUMENTOS DE USUARIOS
export const uploaderDocument = multer({storage:documentStorage});



//////////////////////////////////////////////////////////////////////////////////


//configuracion para guardar imagenes de productos

const productStorage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"/multer/products/images"));
    },
    filename: function(req,file,cb) {
        cb(null,`${req.body.code}-image-${file.originalname}`);
    }
})

//creamos el UPLOADER IMAGENES DE PRODUCTOS
export const uploaderProduct = multer({storage:productStorage})


export default __dirname;
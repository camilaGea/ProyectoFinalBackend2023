import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { Faker, en } from '@faker-js/faker'
import winston from 'winston'
import {config} from './config/config.js'

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
/*
const logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({level: 'http'}),
        new winston.transports.File({filename: './logs/errors.log', level: 'error'})
    ]
})
*/

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

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export default __dirname;
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { Faker, en,es} from '@faker-js/faker'
//import multer from 'multer';


export const customFaker = new Faker({
    //Por Ej. el idioma
    locale: [en],
})

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
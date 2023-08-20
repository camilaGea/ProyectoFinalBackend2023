import dotenv from "dotenv";

dotenv.config();

const ENVIRONMENT = "production"
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const CORREO_ADMIN = process.env.CORREO_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;
const SECRET = process.env.SECRET;
const EMAIL = process.env.ADMIN_EMAIL;
const PASS = process.env.ADMIN_PASS;

export const config = {
    server: {
        port: PORT
    },
    mongo: {
        url: MONGO_URL
    },
    auth: {
        account: CORREO_ADMIN,
        pass: PASSWORD_ADMIN
    },
    session: {
        secret: SECRET
    },
    entorno: {
        environment: ENVIRONMENT
    },
    gmail: {
        adminEmail: EMAIL,
        adminPass: PASS
    }
}
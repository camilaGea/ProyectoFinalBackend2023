import UserService from '../services/user.services.js'
import {CustomError} from '../errors/customError.js'
import {EError} from '../errors/enum.js'
import {generateUserErrorInfo} from '../errors/infoError.js'
import { createHash, validatePassword, generateToken, transport, verifyEmailToken} from '../utils.js'

const userService = new UserService()

class SessionsControllers{

    forgotpass = async (req,res) => {
        try {
            const { email } = req.body;
            //verifico si existe
            
            const user = await userService.getUser({email:email})
           
            if(!user){
                return res.send(`<div>Error, <a href="/forgotpassword">Intente de nuevo</a></div>`)
            }
            const token = generateToken(email);

            await transport.sendMail({
                from: 'servicio de node',
                to:email,
                subject: 'restablecer contraseña',
                html: `
                <div>
                    <h1> click para restablecer contraseña </h1>
                    <a href = "http://localhost:3000/resetpassword?token=${token}"> restablecer contraseña </a>
                </div>`

            })
            
            res.send("Se envio un correo a su cuenta para restablecer la contraseña, volver  <a href='/login'>al login</a>")
        } catch (error) {
            return res.send(`<div>Error, <a href="/forgotpassword">Intente de nuevo</a></div>`)
    
        }
    }

    resetpass = async (req,res) => {
        try {
            const token = req.query.token;
            const {email, newPassword} = req.body;
            //validamos el token
            const validEmail = verifyEmailToken(token) 
            if(!validEmail){
             return res.send(`El enlace ya no es valido, genere uno nuevo: <a href="/forgotpassword">Nuevo enlace</a>.`)
            }
            const user = await userService.getUser({email:email});
            if(!user){
             return res.send("El usuario no esta registrado.")
            }
            if(validatePassword(newPassword,user)){
             return res.send("No puedes usar la misma contraseña.")
            }
            const userData = {
             ...user._doc,
             password:createHash(newPassword)
            };

            const userUpdate = await  userService.updateUserByEmail({email:email},userData);
            res.render("login",{message:"contraseña actualizada"})
 
        } catch (error) {
            res.send(error.message)
        }
    }

    register =  async (req, res) =>{
        try{
            //res.status(200).send({ message:"User registered"});
            req.logger.info("Registro Completado")
            res.redirect("/login")
        }catch(error){
            res.status(500).send(error.message)
        }
    }

    registerFail = async (req, res) => {
        try{
            CustomError.createError({
                name: "Product error",
                cause: generateUserErrorInfo(req.body),
                message: "Error al crear un Producto",
                errorCode: EError.INVALID_JSON
            })
        }catch(error){
            req.logger.error("fallo al registarse");
            res.status(400).send({ error: error.message});

        }
    }

    login = async (req,res)=>{
        try{
            if(!req.user) {
                return res.status(400).send({status:"error", error: 'Invalid credentials'});
            }

            let user = req.user
            req.session.user = {
                nombre: req.user.nombre,
                email: req.user.email,
                edad: req.user.edad,
                rol: req.user.rol
            }

            let last_connection = new Date()
            await userService.updateLastConnection(user.email, last_connection)
            res.status(200).send({payload: user, message:"Primer logueo!!"})

        }catch(error){
            req.logger.error("fallo el login")
            res.status(500).send({error: error.message})
        }
    }

    loginFail = async (req,res)=>{
        req.logger.error("fallo el ingreso")
        res.send({error: 'Error en el ingreso'})
    }

    logout = (req,res)=>{
        req.session.destroy(err =>{
            if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
            res.redirect('/login');
        })
    }

    githubCallBack =  async (req,res)=>{
        req.session.user = req.user;
        res.redirect('http://localhost:3000/products')
    }

    current = async (req, res) =>{
        try{
            let user = await userService.getUser(req.session.email)
            res.send(user)
        }catch(error){
            req.logger.error(error)
        }
    }
}

export default SessionsControllers
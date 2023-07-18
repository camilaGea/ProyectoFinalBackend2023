import UserService from '../services/user.services.js'
import {CustomError} from '../errors/customError.js'
import {EError} from '../errors/enum.js'
import {generateUserErrorInfo} from '../errors/infoError.js'

const userService = new UserService()

class SessionsControllers{

    register =  async (req, res) =>{
        try{
            res.status(200).send({ message:"User registered"});
            req.logger.info("Registro Completado")
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
                return res.status(400).send({status:"error 1", error: 'Invalid credentials'});
            }

            let user = req.user
            req.session.user = {
                nombre: req.user.nombre,
                email: req.user.email,
                edad: req.user.edad,
                rol: req.user.rol
            }
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
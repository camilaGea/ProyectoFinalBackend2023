import userModel from '../dao/models/user.model.js';

const userService = new userModel()

class SessionsControllers{

    register =  async (req, res) =>{
        res.send({status:"succes", message:"User registered"});
    }

    registerFail = async(re,res)=>{
        console.log('Fallo en el ingreso');
        res.send({error: 'Error en el ingreso'})
    }

    login = async (req,res)=>{

        console.log('PASO POR LOGIN CONTROLLERS ', req.user)
        if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});
        let user = req.user
    
        req.session.user = {
            nombre: req.user.nombre,
            email: req.user.email,
            edad: req.user.edad,
            rol: req.user.rol
        }
        console.log('PASO POR LOGIN CONTROLLERS sessions ', req.session)
        console.log(user)
        res.send({status:"success", payload: user, message:"Primer logueo!!"})
    }

    loginFail = async (req,res)=>{
        console.log('Fallo en el ingreso');
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
            let user = await userModel.findOne(req.session.email)
            res.send(user)
        }catch(error){
            console.log(error)
        }
    }
}

export default SessionsControllers
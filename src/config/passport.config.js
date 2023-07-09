import passport from 'passport'
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import GitHubStrategy from 'passport-github2';
import {createHash, validatePassword} from '../utils.js'
import CartsService from '../services/cart.service.js'
import {config} from './config.js'

const cartService = new CartsService()
const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.serializeUser((user,done)=>{
        console.log("serializeUser" + user)
        done(null, user._id)
    });

    passport.deserializeUser( async (id, done)=>{
        try {
            let user = await userModel.findById(id)
            console.log("deserializeUser" + user)
            done(null, user)
        } catch (error) {
            console.log("deserializeUser error" + error)
            //console.log(error)
            done(error)
        }
    })
    
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req,username, password,done) =>{
            const { nombre, apellido, email, edad } = req.body;
            try {
                const user = await userModel.findOne({email:username}); 
                if(user){
                    console.log('El usuario existe');
                    return done(null,false);
                }
                const emailAdmin = config.auth.account
                const passAdmin = config.auth.pass
                if (email == emailAdmin && password == passAdmin) {
                    const newUser = {
                        nombre, apellido, email, edad, password: createHash(password) , rol: 'admin'
                    }
                    const result = await userModel.create(newUser);
                    return done(null, result);
                }

                const cart = await cartService.newCart()
                
                const newUser = {
                    nombre, 
                    apellido, 
                    email, 
                    edad,
                    cart: cart._id,
                    password: createHash(password)
                }

                const result = await userModel.create(newUser);
                return done(null, result);

            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));

    passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done)=>{

        try {
           
           const user = await userModel.findOne({email:username})
           //console.log(user);
            if(!user){
                console.log('No existe el usuario');
                return done(null, false);
            }
            if(!validatePassword(password,user)) return done (null, false);
            return done(null,user);

        } catch (error) {
            
            return done("Error al intentar ingresar: " + error);
            
        }

    }))

    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.3c0456ec3ee7ed36',
        clientSecret:'183cee86e9c62e3c301b0123c9712cfab7ffda93',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        scope: ["user:email"],
    }, async (accesToken, refreshToken,profile,done)=>{
        try {
            console.log('profile' + profile._json); //vemos toda la info que viene del profile
            const email = profile.emails[0].value;
            let user = await userModel.findOne({email}).exec()
            if(!user){

                const cart = await cartService.newCart()
                const newUser = {
                        nombre: profile._json.name,
                        apellido:'',
                        email: email,
                        edad: 18,
                        cart: cart._id,
                        password: '',
                }
                const result = await userModel.create(newUser);
                done(null,result)
            }else{
                //ya existe
                done(null, user)
            }

        } catch (error) {
            return done(null,error)
        }
    }))

}

export default initializePassport;
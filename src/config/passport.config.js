import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2';
import {createHash, validatePassword} from '../utils.js'
import CartsService from '../services/cart.service.js'
import {config} from './config.js'
import UserService from '../services/user.services.js'

const userService = new UserService()
const cartService = new CartsService()
const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.serializeUser((req, user,done)=>{
        req.logger.info('serialize user')
        done(null, user._id)
    });

    passport.deserializeUser( async (req, id, done)=>{
        try {
            let user = await userService.getUserById(id)
            req.logger.info('deserialize User')
            done(null, user)
        } catch (error) {
            req.logger.error('Deserialize User error')
            done(error)
        }
    })
    
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req, username, password, done) =>{
            const { nombre, apellido, email, edad } = req.body;
            try {
                if (!nombre || !apellido || !email || !edad) {
                    return done(null,false, req.body); // 
                }
                const user = await userService.getUser({email:username}); 
                if(user){
                    req.logger.info('el usuario existe')
                    return done(null,false);
                }
                const emailAdmin = config.auth.account
                const passAdmin = config.auth.pass
                if (email == emailAdmin && password == passAdmin) {
                    const newUser = {
                        nombre, apellido, email, edad, password: createHash(password) , rol: 'admin'
                    }
                    const result = await userService.addUser(newUser);
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

                const result = await userService.addUser(newUser);
                return done(null, result);

            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login', new LocalStrategy({usernameField:'email'}, 
    async (username, password, done)=>{
        //logger = req.logger
        try {
           const user = await userService.getUser({email:username})
           if(!user){
               
               return done(null, false);
            }
            if(!validatePassword(password,user)){
                return done (null, false);
            } 
                
            return done(null,user);

        } catch (error) {
            return done(error);
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.3c0456ec3ee7ed36',
        clientSecret:'183cee86e9c62e3c301b0123c9712cfab7ffda93',
        callbackURL: 'http://localhost:3000/api/sessions/githubcallback',
        scope: ["user:email"],
    }, async (req, accesToken, refreshToken,profile,done)=>{
        logger = req.logger
        try {
            logger.info(profile._json) //vemos toda la info que viene del profile
            const email = profile.emails[0].value;
            let user = await userService.getUser({email}).exec()
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
                const result = await userService.addUser(newUser);
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
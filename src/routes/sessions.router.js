import { Router } from 'express';
import passport from 'passport';
import SessionsControllers from '../controllers/sessions.controllers.js'
import { uploaderProfile } from "../utils.js"

const sessionsControllers = new SessionsControllers()
const router = Router();

router.post('/register', uploaderProfile.single("avatar") , passport.authenticate('register', {failureRedirect:'/api/sessions/failregister'}), sessionsControllers.register)
router.get('/failregister', sessionsControllers.registerFail)

router.post('/login', passport.authenticate('login', {failureRedirect:'/api/sessions/faillogin'}) , sessionsControllers.login)
router.get('/faillogin', sessionsControllers.loginFail)

router.get('/logout', sessionsControllers.logout)

router.get('/github', passport.authenticate('github'), async (req,res)=>{})
router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), sessionsControllers.githubCallBack)

router.get('/current', sessionsControllers.current)

router.post('/forgotpassword', sessionsControllers.forgotpass)
router.post('/resetpassword', sessionsControllers.resetpass)

export default router;
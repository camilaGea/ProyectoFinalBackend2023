import { Router } from 'express';
import passport from 'passport';
import SessionsControllers from '../controllers/sessions.controllers.js'

const sessionsControllers = new SessionsControllers()
const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/failregister'}), sessionsControllers.register)
router.post('/failregister', sessionsControllers.registerFail)

router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), sessionsControllers.login)
router.get('/faillogin', sessionsControllers.loginFail)

router.get('/logout', sessionsControllers.logout)

router.get('/github', passport.authenticate('github'), async (req,res)=>{})
router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), sessionsControllers.githubCallBack)

router.get('/current', sessionsControllers.current)

export default router;
import UserService from '../services/user.services.js'
import {config} from '../config/config.js'

export const userService = new UserService()

class  UserController {

    deleteUser = async (req, res) => {
        const {uemail} = req.params
        try {
            await userService.deleteUser(uemail)
            res.send({status: "ok"})
        } catch (error) {
            req.logger.error(error);
        }
    }

    changeRoll = async (req, res) => {
        const {uemail} = req.params
        const {rol} = req.body

        try {
            let user = await userService.getUser(uemail) //busco el usuario
            if (!user) res.send({status: 'error', message: 'El usuario no existe'}) //verifico que exista

            req.logger.info('rol: ', rol);
            let newuser = userService.updateRoll(uemail, rol)  //actualizo

            res.redirect('/users');
        } catch (error) {
            req.logger.error(error);
        }
    }

    deleteUsers = async (req,res) => {
       try {
            let users = await userService.getUsers() //busco los usuarios
            users.forEach(async user => { //los recorro
                try {
                    
                    let lastConnection = user.last_connection;
                    
                    let now = new Date();
                    req.logger.info("user.last_connection: ", user.last_connection)
                    
                    let differenceInMilliseconds = now - lastConnection;
                    let differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
                    
                    req.logger.info(`LC: ${lastConnection}; now: ${now}`)
                    req.logger.info('diferencia: ', differenceInDays)
                    req.logger.info('User.email: : ', user.email)
                    if (differenceInDays > 2) {
                        await userService.deleteUser(user.email)

                        const transport = createTransport({
                            service: 'gmail',
                            port: 578,
                            auth: {
                                user: config.adminEmail,
                                pass: config.adminPass
                            }
                        })

                        let result = await transport.sendMail({
                            from:'Servicio de Node',
                            to: user.email,
                            subject: 'Su cuenta fue eliminada',
                            html: `
                            <div>
                                <h1>Su cuenta fue eliminada por inactividad</h1>
                            </div>`
                        })

                        req.logger.info(result)
                    }
                } catch (error) {
                    req.logger.error(error);
                }
            })
            res.send({status: "ok"})
        } catch (error) {
            req.logger.error(error)
        }
    }

    getUsers = async (req, res) => {
        try {
            let users = await userService.getUsers()
            let saveUsers = []
            users.forEach(user => {
                saveUsers.push({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    roll: user.roll
                })
            });
            res.send({status: "ok", data: saveUsers})
        } catch (error) {
            req.logger.error(error)
        }
    }

    rollSwitch = async (req, res) => {
        try {
            const userId = req.params.id;
            //verificar si el usuario existe en la base de datos
            const user = await userService.getUserById(userId);
            const userRol = user.rol;
            if(userRol === "user"){
                let iden = user.documents.find(document => document.name == 'identificacion')
                let compDom = user.documents.find(document => document.name == 'domicilio')
                let compEsta = user.documents.find(document => document.name == 'estadoDeCuenta')

                if (!iden || !compDom || !compEsta) return res.send({status: 'error', message: 'no cuenta con toda la documentacion subida'})

                user.rol = "premium"
            }  
            if(userRol === "premium"){
                user.rol = "user"
            }

            await userService.updateUserById({_id:user._id},user);

            return res.send({status:"success", message:"rol modificado"});

        } catch (error) {
            
            return res.send({status:"error", message:"hubo un error al cambiar el rol del usuario"})
        }
    }

    updateUserDocument = async (req, res) => {
        try {
            const userId = req.params.uid
            const user = await userService.getUserById(userId);

            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
            
            const docs = [];

            if(identificacion){
                docs.push({name:"identificacion", reference:identificacion.filename})
            }
            if(domicilio){
                docs.push({name:"domicilio", reference:domicilio.filename})
            }
            if(estadoDeCuenta){
                docs.push({name:"estadoDeCuenta", reference:estadoDeCuenta.filename})
            }

            if(docs.length === 3){
                user.status = "completo"
            }else{
                user.status = "incompleto"
            }

            user.documents = docs;

            const userUpdate = await userService.updateUserById(user._id,user)

            res.json({status:"success", message:"Documentos actualizados"})

        } catch (error) {
           
            res.json({status:"error", message: "Hubo un error en la carga de los archivos."})
        }
    }

}

export default UserController
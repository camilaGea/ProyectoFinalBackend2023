import UserService from '../services/user.services.js'

const userService = new UserService()

class  UserController {

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
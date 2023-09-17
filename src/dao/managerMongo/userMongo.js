import userModel from '../models/user.model.js'

export class UserManagerMongo{

    //agrega un usuario
    async addUser(user){
        try {
            return await userModel.create(user)
        } catch (error) {
            return error
        }
    }

    //busca un usuario por su id
    async getUserById( id){
        try {
            let user = await userModel.findById(id)
            return user
        } catch (error) {
            return error
        }
    }
    
    //busca todo los usuarios
    async getUsers(){
        try {
            let users = await userModel.find()
            return users
        } catch (error) {
            return error
        }
    }

    //busca un usuario por un email
    async getUser(email){
        try {
            let user = await userModel.findOne(email)
            return user
        } catch (error) {
            return error
            
        }
    }

    //actualizar un usuiario pasando el email del usuario y el body que representa lo que se actualiza
    async updateUser(email, body){
        try{
            return await  userModel.findOneAndUpdate( email,body)
        }catch(error){
            return error
        }
    }

    //actualiza un usuario pasando el id del usuario y el user lo que se actualiza
    async updateUserId(id, user){
        try{
            return await  userModel.findByIdAndUpdate( id,user)
        }catch(error){
            return error
        }
    }

    //actualizo la propiedad lastConnection del usuario
    async updateLastConnection (email, data){
        try {
            let user = await userModel.updateOne(
                { email: email }, { $set: { 'last_connection': data }}
            )
            return user
        } catch (error) {
           return error
        }
    }

    async updateRoll(email, rol){
        try {
            let user = await userModel.updateOne(
                { email: email}, { $set: { 'rol': rol}}
            )
            return user
        } catch (error) {
            return error
        }
    }

    async deleteUser(email){
        try {
            await userModel.findOneAndDelete({email: email})
        } catch (error) {
            return error
          
        }
    }

}
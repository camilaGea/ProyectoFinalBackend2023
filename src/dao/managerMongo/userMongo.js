import userModel from '../models/user.model.js'

export class UserManagerMongo{
    async addUser(user){
        try {
            return await userModel.create(user)
        } catch (error) {
            console.log(error)
        }
    }

    async getUsers(){
        try {
            let users = await userModel.find()
            return users
        } catch (error) {
            console.log(error)
        }
    }
    
    async getUser(email){
        try {
            let user = await userModel.findOne({email: email})
            return user
        } catch (error) {
            console.log(error)
        }
    }
}
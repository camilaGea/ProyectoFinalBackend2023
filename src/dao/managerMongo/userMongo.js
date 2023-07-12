import userModel from '../models/user.model.js'

export class UserManagerMongo{
    async addUser(user){
        try {
            return await userModel.create(user)
        } catch (error) {
            console.log(error)
        }
    }

    async getUserById(id){
        try {
            let user = await userModel.findOne({ _id: id })
            return user
        } catch (error) {
            console.log(error)
        }
    }
    
    async getUser(email){
        try {
            let user = await userModel.findOne(email)
            return user
        } catch (error) {
            console.log(error)
        }
    }
}
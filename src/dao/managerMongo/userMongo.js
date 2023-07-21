import userModel from '../models/user.model.js'

export class UserManagerMongo{
    async addUser(req, res, user){
        try {
            return await userModel.create(user)
        } catch (error) {
            req.logger.error(error)
        }
    }

    async getUserById(req, res, id){
        try {
            let user = await userModel.findOne({ _id: id })
            return user
        } catch (error) {
            req.logger.error(error)
        }
    }
    
    async getUser(req, res, email){
        try {
            let user = await userModel.findOne(email)
            return user
        } catch (error) {
            req.logger.error(error)
        }
    }
}
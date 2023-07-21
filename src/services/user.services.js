import { UserManagerMongo } from "../dao/managerMongo/userMongo.js";
import { UserDTO } from "../dao/DTOs/user.dto.js";

const mongoUserManager = new UserManagerMongo

class UserService {
    async addUser(req, user){
        try {
            let usuario = new UserDTO(user)
            return await mongoUserManager.addUser(usuario)
        } catch (error) {
            req.logger.error(error)
        }
    }

    async getUsers(req, res){
        try {
            let users = await mongoUserManager.getUsers()
            return users
        } catch (error) {
            req.logger.error(error)
        }
        
    }

    async getUser(req, email){
        try {
            let user = await mongoUserManager.getUser(email)
            return user
        } catch (error) {
            req.logger.error(error)
        }
    }
    async getUserById(req, id){
        try {
            let user = await mongoUserManager.getUserById(id)
            return user
        } catch (error) {
            req.logger.error(error)
        }
    }
}

export default UserService
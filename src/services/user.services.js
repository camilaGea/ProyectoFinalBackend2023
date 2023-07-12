import { UserManagerMongo } from "../dao/managerMongo/userMongo.js";
import { UserDTO } from "../dao/DTOs/user.dto.js";

const mongoUserManager = new UserManagerMongo

class UserService {
    async addUser(user){
        try {
            let usuario = new UserDTO(user)
            return await mongoUserManager.addUser(usuario)
        } catch (error) {
            console.log(error)
        }
    }

    async getUsers(){
        try {
            let users = await mongoUserManager.getUsers()
            return users
        } catch (error) {
            console.log(error)
        }
        
    }

    async getUser(email){
        try {
            let user = await mongoUserManager.getUser(email)
            return user
        } catch (error) {
            console.log(error)
        }
    }
    async getUserById(id){
        try {
            let user = await mongoUserManager.getUserById(id)
            return user
        } catch (error) {
            console.log(error)
        }
    }
}

export default UserService
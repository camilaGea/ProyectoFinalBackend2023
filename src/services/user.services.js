import { UserManagerMongo } from "../dao/managerMongo/userMongo.js";
import { UserDTO } from "../dao/DTOs/user.dto.js";

const userDTO = new UserDTO
const mongoUserManager = new UserManagerMongo

class UserService {
    async addUser(user){
        try {
            let usuario = await userDTO.user(user)
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
            let userEmail = await userDTO.userByEmail(email)
            let user = await mongoUserManager.getUser(userEmail)
            return user
        } catch (error) {
            console.log(error)
        }
    }
}

export default UserService
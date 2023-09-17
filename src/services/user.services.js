import { UserManagerMongo } from "../dao/managerMongo/userMongo.js";
import { UserDTO } from "../dao/DTOs/user.dto.js";

const mongoUserManager = new UserManagerMongo

class UserService {
    async addUser(user){
        try {
            let usuario = new UserDTO(user)
            return await mongoUserManager.addUser(usuario)
        } catch (error) {
            return error
        }
    }

    async getUsers(){
        try {
            let users = await mongoUserManager.getUsers()
            return users
        } catch (error) {
            return error
        }
        
    }

    async getUser( email){
        try {
            let user = await mongoUserManager.getUser({email})
            return user
        } catch (error) {
            return error
        }
    }

    async getUserById(id){
        try {
            let user = await mongoUserManager.getUserById(id)
            return user
        } catch (error) {
           return error
        }
    }
    
    async updateUserByEmail (email,body){
        const user = await mongoUserManager.updateUser(email, body)
        return user
    }
    async updateUserById (id,user){
        const result = await mongoUserManager.updateUserId(id, user)
        return result
    }

    async updateLastConnection (email, data){
        try {
            let user = await mongoUserManager.updateLastConnection(email, data)
            return user
        } catch (error) {
           return error
        }
    }

    async deleteUser(email){
        try {
            await mongoUserManager.deleteUser(email)
        } catch (error) {
            console.log(error)
        }
    }

    async updateRoll (email, rol){
        try {
            let user = await mongoUserManager.updateRoll(email, rol)
            return user
        } catch (error) {
            console.log(error)
        }
    }
}

export default UserService
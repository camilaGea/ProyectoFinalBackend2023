export class UserDTO {
    constructor(user){
        this.nombre = user.nombre
        this.apellido = user.apellido
        this.edad = user.edad
        this.rol = user.rol
        this.email = user.email
        this.cart = user.cart
        this.password = user.password
    }
    async user(user){
        return {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            roll: user.roll,
            email: user.email,
            cart: user.cart,
            password: user.password
        }
    }
    async userByEmail(email){
        return {
            email: email
        }
    }
}

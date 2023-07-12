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
}

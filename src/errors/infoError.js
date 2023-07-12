export const generateProductErrorInfo = (product)=>{
    return `Una o más propiedades estan incompletas o no son válidas.
    Lista de propiedades requeridas:
        - title: Debe ser un campo string, pero recibio: ${product.title}
        - description: Debe ser un campo string, pero recibio: ${product.description}
        - code: Debe ser un campo Number, pero recibio: ${product.code}
        - price: Debe ser un campo Number, pero recibio: ${product.price}
        - status: Debe ser un campo string, pero recibio: ${product.status}
        - stock: Debe ser un campo Number, pero recibio: ${product.stock}
        - category: Debe ser un campo string, pero recibio: ${product.category}
        - thumbnail: Debe ser un campo string, pero recibio: ${product.thumbnail}`
}

export const generateUserErrorInfo = (user) => {
    return ` una o mas propiedades estan incompletas o no son validas.
    Lista de propiedades requeridas:
        -nombre: Debe ser un campo String, recibo: ${user.nombre}
        -apellido: Debe ser un campo String, recibo: ${user.apelido}
        -edad: Debe ser un campo Number, recibo: ${user.edad}
        -rol: Debe ser un campo String, recibo: ${user.rol} 
        -email: Debe ser un campo String, recibo: ${user.email} 
        -password: Debe ser un campo String, recibo: ${user.password} `
}

export const generateProductErrorParam  = (pid)=>{
    return ` Producto id no es valido, necesita ser un ObjectId mongo, pero se recibio: ${pid}`
}

export const generateCartErrorParam = (cid) =>{
    return `El cart que busca no estaba en DB.
    Lista de propiedades requeridas:
        - cid: necesita ser un ObjectId mongo, pero recibio ${cid}`
}

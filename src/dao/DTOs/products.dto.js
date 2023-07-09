export default class ProductoDTO{
    constructor(product){
        this.title = product.title,
        this.description = product.description,
        this.price = product.price,
        this.thumbnail = product.thumbnail,
        this.code = product.code,
        this.status = product.status,
        this.stock = product.stock,
        this.category = product.category
    }
}
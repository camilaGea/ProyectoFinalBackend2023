import cartModel from "../models/cart.model.js"

export default class CartMongo{

    async getCarts (){
        try{
            return await cartModel.find()
        }catch(error){
            return { status: "error", error: error };
        }
    }

    async addCart(){
        try{
            return await cartModel.create({})
        }catch(error){
            return { status: "error", error: error };
        }
    }

    async getCartById(cid){
        return await cartModel.findOne({_id: cid}).lean()
    }

    async addProductInCart (cid, pid){
        let cartResult = await cartModel.findOne({ _id: cid })
        const productResult = cartResult.product.find((prod) => prod.idProduct._id == pid)
            
        if(productResult){
                return await cartModel.updateOne({_id:cid,'product.idProduct': pid}, {$inc: {'product.$.quantity': 1}})
        }else{
                return await cartModel.updateOne({_id:cid}, {$push: {product: {idProduct: pid , quantity: 1}}})
        }
    }

    async deleteProductInCart (cid,pid){
        let cartresult = await cartModel.findOne({ _id: cid })
        const products = cartresult.product.filter((prod) => prod.idProduct._id != pid)
        return await cartModel.updateOne({_id: cid}, {$set: {product: products}})
    }

    async updateProductInCart (cid, cambio){
        return await cartModel.updateOne({_id:cid}, {$set: {product: cambio}} )
    }

    async updateQtyProductInCart (cid, pid , qty){
        return await cartModel.updateOne({'product.idProduct': pid, _id:cid} , {$set: { 'product.$.quantity': qty }})
    }

    async deleteProductsInCart(cid){
        return await cartModel.updateOne({_id:cid}, {$set: {product: []}} )

    }
}
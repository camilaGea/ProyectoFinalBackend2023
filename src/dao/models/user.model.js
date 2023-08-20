import mongoose from 'mongoose';
import {Schema} from 'mongoose'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    nombre:{
        type: String,
        require: true
    },
    apellido:{
        type: String,
        require: true
    },
    edad:{
        type: Number,
        require: true
    },
    rol:{
        type: String,
        default: "user"
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    cart:{
        type: Schema.Types.ObjectId,
        ref: 'carts',
        require:true
    },
    documents:{
        type: [{
            name:{ type: String},
            reference:{ type: String}
        }],
        default: []
    },
    last_connection:{
        type: Date,
        default: null
    },
    status:{
        type:String,
        require:true,
        enums:["completo","incompleto","pendiente"],
        default:"pendiente"
    }
})

userSchema.pre('find', function(){
    this.populate('cart')
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel;
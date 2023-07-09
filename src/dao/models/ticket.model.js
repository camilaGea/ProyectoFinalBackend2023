import { Schema } from "mongoose";
import mongoose from 'mongoose';


const ticketCollection = 'tickets'


const ticketSchema = new  Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type:  String
    },
    amount:{
        type: Number,
        required: true
    },
    purchaser:{
        type: String,
        require: true
    }
})


const ticketModel = mongoose.model(ticketCollection, ticketSchema)


export default ticketModel;

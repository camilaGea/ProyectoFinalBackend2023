import ticketModel from "../models/ticket.model.js";

export class TicketManager{
    async  createTicket( code, purchase_datetime, amount, purchaser){
        try {
            return await ticketModel.create({code, purchase_datetime, amount, purchaser})
        } catch (error) {
            return error
        }
    }
}

import ticketModel from "../models/ticket.model.js";

export class TicketManager{
    async  createTicket(code, purchase_datetime, amount, purchaser){
        try {
            console.log(JSON.stringify(purchaser))
            return await ticketModel.create({code, purchase_datetime, amount, purchaser})
        } catch (error) {
            console.log(error);
        }
    }
}

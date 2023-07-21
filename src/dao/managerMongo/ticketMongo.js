import ticketModel from "../models/ticket.model.js";

export class TicketManager{
    async  createTicket(req, res, code, purchase_datetime, amount, purchaser){
        try {
            return await ticketModel.create({code, purchase_datetime, amount, purchaser})
        } catch (error) {
            req.logger.error(error)
        }
    }
}

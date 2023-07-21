export class CustomError{
    static createError( req,res, {name="Error",cause,message,errorCode}){
        const error = new Error(message);
        error.name = name;
        error.code = errorCode;
        error.cause = cause;
        req.logger.info("error", error.cause)
        throw error;
    }
}
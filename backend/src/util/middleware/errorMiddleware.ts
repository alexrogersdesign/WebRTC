import HttpException from "../HttpException";
import {Request, Response} from "express";

const errorMiddleware = (err:HttpException, req:Request, res:Response) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
}
export default errorMiddleware;
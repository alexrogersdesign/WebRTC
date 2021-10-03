import HttpException from "../HttpException";
import {Request, Response} from "express";

const errorMiddleware = (err:HttpException, req:Request, res:Response) => {
    if (err.name === 'UnauthorizedError') {
        console.log('error handler triggered')
        // res.status(401).send('invalid token...');
        res.status(err.status).send({message:err.message});
        console.log(err)
        return
    }
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
}
export default errorMiddleware;
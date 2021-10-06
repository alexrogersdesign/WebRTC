import {Request, Response, ErrorRequestHandler, NextFunction} from "express";
import expressJwt from 'express-jwt'
import * as dotenv from "dotenv";
import HttpException from "../HttpException";
dotenv.config();

const secretKey = process.env.SECRET_KEY
const refreshKey = process.env.SECRET_KEY_REFRESH
if (!secretKey) throw new Error('Secret key not found')
if (!refreshKey) throw new Error('refresh key not found')

export const authRestricted = expressJwt({
    secret: secretKey, algorithms: ['HS256'], requestProperty: 'token', credentialsRequired: true
})

export const authNonRestricted = expressJwt({
    secret: secretKey, algorithms: ['HS256'], requestProperty: 'token', credentialsRequired: false
})
export const authRefresh = expressJwt({
    secret: refreshKey,
    algorithms: ['HS256'],
    requestProperty: 'refreshToken',
    credentialsRequired: false,
    getToken: req => req.cookies.refreshToken
})

export const authErrorHandler = (err: HttpException, req:Request, res:Response, next:NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(err.status).send({message:err.message});
        console.log(`${err.message}, Method: ${req.method} URL: ${req.originalUrl}`)
        return
    }
    next()
}


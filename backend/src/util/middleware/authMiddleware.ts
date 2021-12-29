import {Request, Response, NextFunction} from "express";
import expressJwt from 'express-jwt'
import HttpException from "../HttpException.js";

const secretKey = process.env.SECRET_KEY
const refreshKey = process.env.SECRET_KEY_REFRESH
if (!secretKey) throw new Error('Secret key not found')
if (!refreshKey) throw new Error('refresh key not found')

/**
 * Token authentication middleware for restricted routes where credentials are  required
 */
export const authRestricted = expressJwt({
    secret: secretKey, algorithms: ['HS256'], requestProperty: 'token', credentialsRequired: true
})

/**
 * Token authentication middleware for not restricted routes where credentials are not required
 */
export const authNonRestricted = expressJwt({
    secret: secretKey, algorithms: ['HS256'], requestProperty: 'token', credentialsRequired: false
})
/**
 * Token authentication middleware for handing refresh tokens
 */
export const authRefresh = expressJwt({
    secret: refreshKey,
    algorithms: ['HS256'],
    requestProperty: 'refreshToken',
    credentialsRequired: false,
    getToken: req => req.cookies.refreshToken
})
/**
 * Error handling middleware for errors related to authentication
 * @param {HttpException} err The thrown error
 * @param {e.Request} req The HTTP request
 * @param {e.Response} res The HTTP response
 * @param {e.NextFunction} next
 */
export const authErrorHandler = (err: HttpException, req:Request, res:Response, next:NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({message:err.message});
        console.log(`${err.message}, Method: ${req.method} URL: ${req.originalUrl}`)
        return
    }
    if (err.name === 'UnauthorizedError: jwt malformed') {
        res.status(err.status).send({message:err.message});
        console.log(`${err.message}, Method: ${req.method} URL: ${req.originalUrl}`)
        return
    }
    if (err.name === 'InvalidTokenError') {
        console.log(`${err.message}, Token: ${req.cookies.refreshToken} `)
        res.status(err.status).send({message:err.message});
    return
    }
    else console.log(err)
    next()
}


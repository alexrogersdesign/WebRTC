import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.SECRET_KEY
const refreshSecretKey = process.env.SECRET_KEY_REFRESH
const envTokenLife= process.env.TOKEN_LIFE
const envRefreshTokenLife= process.env.REFRESH_TOKEN_LIFE
const tokenLife = typeof envTokenLife === 'string'? parseInt(envTokenLife): envRefreshTokenLife
const refreshTokenLife = typeof envRefreshTokenLife === 'string'? parseInt(envRefreshTokenLife): envRefreshTokenLife

import jwtDecode from "jwt-decode";
import {UserModel} from "../database/models.js";
import {authErrorHandler, authNonRestricted, authRefresh} from "../util/middleware/authMiddleware.js";
type TokenItem = {
    status: string,
    token: string,
    refreshToken: string
}
type TokenList = {
    [key :string]: TokenItem
}
export type DecodedToken = {
    email: string,
    id: string
}
const tokenList: TokenList = {}
const loginRouter = express.Router();
loginRouter.use(authErrorHandler)

loginRouter.post('/', authNonRestricted, async (req, res) => {
    const {email, password} = req.body
    const foundUser = await UserModel.findOne({email: email})
    const passwordMatch = foundUser && await bcrypt.compare(password, foundUser.passwordHash)
    if (!foundUser || !passwordMatch) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }
    const tokenInfo = {
        email: foundUser.email,
        id: foundUser._id,
    }
    if (!secretKey ) throw new Error('missing token secret key')
    if (!refreshSecretKey ) throw new Error('missing refresh token secret key')
    //* Sign the token
    const token = jwt.sign(tokenInfo, secretKey, {expiresIn:tokenLife})
    //* Sign the refresh token
    const refreshToken =jwt.sign(tokenInfo, refreshSecretKey, {expiresIn:refreshTokenLife})
    if (!token) {
        return res.status(500).json({
            error: 'unable to generate token'
        })
    }
    const response = {
        status: 'Logged in',
        token,
        refreshToken,
        user: foundUser.toObject()
    }
    tokenList[refreshToken] = response
    res
        .cookie('refreshToken', refreshToken, {httpOnly:true})
        .status(200).send(response)
})

loginRouter.post('/refresh', async (req,res) => {
    const {refreshToken} = req.cookies
    //* Decode token to retrieve email information.
    const {email} = jwtDecode<DecodedToken>(refreshToken);
    const foundUser = await UserModel.findOne({email: email})
    if((!refreshToken) || !(refreshToken in tokenList) || !foundUser) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }
        const tokenInfo = {
            email: foundUser.email,
            id: foundUser._id,
        }
        if (!secretKey) throw new Error('missing token or refresh token key')
        //* Sign new token.
        const token = jwt.sign(tokenInfo, secretKey, { expiresIn: tokenLife})
        const response = {token, user:foundUser}
        //* Update token in list.
        tokenList[refreshToken].token = token
        res
            .cookie('refreshToken', refreshToken, {httpOnly:true})
            .status(200).send(response)
})

loginRouter.get('/logout', (req, res )=> {
    res
        .cookie('refreshToken', '', {
            expires: new Date(0),
            httpOnly:true,
        })
        .status(200).send('User Logged Out')
})
export default loginRouter
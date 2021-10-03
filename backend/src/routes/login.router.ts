import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.SECRET_KEY
const refreshSecretKey = process.env.SECRET_KEY_REFRESH
const tokenLife = parseInt(process.env.TOKEN_LIFE)
const refreshTokenLife = parseInt(process.env.REFRESH_TOKEN_LIFE)

import {UserModel} from "../database/models.js";
import {authNonRestricted, authRefresh} from "../util/middleware/authMiddleware.js";
type TokenItem = {
    status: string,
    token: string,
    refreshToken: string
}
type TokenList = {
    [key :string]: TokenItem
}

const tokenList: TokenList = {}
const loginRouter = express.Router();
// loginRouter.use(authNonRestricted)

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
    console.log('tokenlife', tokenLife)
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
    res
        .cookie('refreshToken', refreshToken, {httpOnly:true})
        .status(200).send(response)
})

loginRouter.post('/refresh', authRefresh, async (req,res) => {
    const {email, refreshToken} = req.body
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
        const response = {token}
        //* Update token in list.
        tokenList[refreshToken].token = token
        res
            .cookie('refreshToken', refreshToken, {httpOnly:true})
            .status(200).send(response)
})
export default loginRouter
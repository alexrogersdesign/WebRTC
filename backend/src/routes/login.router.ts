import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.SECRET_KEY


import {UserModel} from "../database/models.js";
import {authNonRestricted} from "../util/middleware/authMiddleware.js";

const loginRouter = express.Router();
loginRouter.use(authNonRestricted)

loginRouter.post('/', async (request, response) => {
    const {email, password} = request.body

    const foundUser = await UserModel.findOne({email: email})
    const passwordMatch = foundUser && await bcrypt.compare(password, foundUser.passwordHash)

    if (!foundUser || !passwordMatch) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }
    const tokenInfo = {
        email: foundUser.email,
        id: foundUser._id,
    }
    const token = secretKey? jwt.sign(tokenInfo, secretKey): null
    // const token = request.token;
    if (!token) {
        return response.status(500).json({
            error: 'unable to generate token'
        })
    }
    response
        .status(200)
        .send({token, email: foundUser.email})
})
export default loginRouter
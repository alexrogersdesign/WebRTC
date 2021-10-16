import express  from "express";
import * as dotenv from "dotenv";
dotenv.config();

import {UserModel} from "../database/models.js";
import {authErrorHandler, authRestricted} from "../util/middleware/authMiddleware.js";
// import {filesMiddleware} from "../util/middleware/filesMiddleware.js";



const fileRouter = express.Router();
fileRouter.use(authErrorHandler)

fileRouter.post('/', authRestricted, async (req, res) => {
    res
        .status(200).send()
})

export default fileRouter
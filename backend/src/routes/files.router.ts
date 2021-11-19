import express  from "express";

import {authErrorHandler, authRestricted} from "../util/middleware/authMiddleware.js";



const fileRouter = express.Router();
fileRouter.use(authErrorHandler)

fileRouter.post('/', authRestricted, async (req, res) => {
    res
        .status(200).send()
})

export default fileRouter
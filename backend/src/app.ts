import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import express from "express";
import errorHandler from 'errorhandler'
import path from 'path';

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


import usersRouter from './routes/users.router.js';
import meetingsRouter from "./routes/meetings.router.js";
import messagesRouter from "./routes/messages.router.js";
import loginRouter from "./routes/login.router.js";

const app = express();

const allowedOrigins = ['http://localhost:3000'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};

/** Parse cookies to a field on the express request object */
app.use(cookieParser());
/** CORS compliance */
app.use(cors(options));
/** Log express activity */
app.use(morgan('dev'));
/** Parse JSON payloads */
app.use(express.json());
/** Parse URL encoded payloads  */
app.use(express.urlencoded({extended: true}));
/** Serve all frontend files statically */
app.use(express.static(path.resolve(__dirname,'..', '../frontend/build')));
/** Apply the various routes */
app.use('/users', usersRouter)
app.use('/meetings', meetingsRouter)
app.use('/messages', messagesRouter)
app.use('/login', loginRouter)

/** Route all other GET traffic to the front end react app */
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname,'..' , '../frontend/build', 'index.html'));
});

/** Apply error handler after the other routes are exhausted  */
app.use(errorHandler)

export default app;

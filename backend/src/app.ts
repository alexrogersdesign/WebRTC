
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import createError from 'http-errors';
import express, {Request, Response} from "express";
import usersRouter from './routes/users.router.js';
import meetingsRouter from "./routes/meetings.router.js";
import messagesRouter from "./routes/messages.router.js";
import loginRouter from "./routes/login.router.js";
import errorMiddleware from "./util/middleware/errorMiddleware.js";
import {authErrorHandler} from "./util/middleware/authMiddleware.js";
import errorHandler from 'errorhandler'

const app = express();
const allowedOrigins = ['http://localhost:3000'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};


app.use(cookieParser());
app.use(cors(options));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/users', usersRouter)
app.use('/meetings', meetingsRouter)
app.use('/messages', messagesRouter)
app.use('/login', loginRouter)
app.get('/', (req, res) => {
  res.send('test');
});



// catch 404 and forward to error handler
// app.use((_req, res, next) => {
//   next(createError(404));
// });


// error handler
// app.use(errorMiddleware)
app.use(errorHandler())

export default app;

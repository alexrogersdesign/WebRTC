
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


app.use(cookieParser());
app.use(cors(options));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname,'..', '../frontend/build')));
app.use('/users', usersRouter)
app.use('/meetings', meetingsRouter)
app.use('/messages', messagesRouter)
app.use('/login', loginRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname,'..' , '../frontend/build', 'index.html'));
});
// app.get('/', (req, res) => {
//   res.send('test');
// });



// catch 404 and forward to error handler
// app.use((_req, res, next) => {
//   next(createError(404));
// });


// error handler
// app.use(errorMiddleware)
app.use(errorHandler)

export default app;

// const createError = require('http-errors');

// const express = require('express');
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import createError from 'http-errors';
import {Request, Response} from "express";
// const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
// const path = require('path');
// const cors = require('cors');
// const {v4: uuidV4} = require('uuid');


const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}


/**
 * Create HTTP Server
 */
app.get('/', (req, res) => {
  res.send('test');
});
// /**
//  * Send uuid meeting link
//  */
// app.get('/join/:meeting', (req, res) => {
//
// });

// catch 404 and forward to error handler
app.use((_req, res, next) => {
  next(createError(404));
});

const errorMiddleware = (err:HttpException, req:Request, res:Response) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

// error handler
app.use(errorMiddleware)

export default app;

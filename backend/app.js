const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const {v4: uuidV4} = require('uuid');


const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


/**
 * Create HTTP Server
 */
app.get('/', (req, res) => {
  res.send('test');
});
/**
 * Send uuid meeting link
 */
app.get('/join', (req, res) => {
  res.send({link: uuidV4()});
});

// catch 404 and forward to error handler
app.use((_req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

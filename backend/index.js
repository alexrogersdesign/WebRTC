#!/usr/bin/env node

const debug = require('debug')('WebRTC:server');
const http = require('http');
const cors = require('cors');

const app = require('./app');

const server = http.createServer(app);

/**
 * Setup cors to allow all origins with GET, POST requests
 */
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
// require('./websocket')(io);
/**
     * Setup socket connection behaviors
     */
io.on('connection', (socket) => {
  /**
        * Inform participants that user has joined
        */
  socket.emit('CurrentUserID', socket.id);

  /**
        * Initiate a call to user()
        */
  socket.on('callUser', ({userToCall, signalData, from, name}) => {
    console.log(userToCall);
    io.to(userToCall).emit('callUser', {signal: signalData, from, name});
  });

  /**
        * Accept a call from another user
        */
  socket.on('answerCall', (data) => {
    io.to(data.to).emit('answerCall', data.signal);
  });

  /**
        * Inform participants that user has left
        */
  socket.on('close', () => {
    socket.broadcast.emit('endcall');
  });

  /**
      * log socket io errors
      */
  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});


/**
 * Normalize a port into a number, string, or false.
 * @param {number} val The port to normalize.
 * @return {number} the normalized port or false if failure.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
// eslint-disable-next-line no-use-before-define
server.on('error', onError);
// eslint-disable-next-line no-use-before-define
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 * @param {object} error an error to process.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
     `Pipe ${port}` :
     `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
     `pipe ${addr}` :
     `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

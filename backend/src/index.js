// #!/usr/bin/env node
let exports = {};
import debugFactory from 'debug';
const debug = debugFactory('WebRTC:server');
import * as http from 'http';
import app from './app.js';
const server = http.createServer(app);
/**
 * Setup cors to allow all origins with GET, POST requests
 */
import { Server as IoFactory } from 'socket.io';
const io = new IoFactory(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
import database from './database/database.js';
database();
// bring in websocket configuration
import websocket from './websocket.js';
websocket(io);
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
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
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
        `port ${addr?.port}`;
    debug(`Listening on ${bind}`);
}

const express = require('express');
const app = express();
const cors = require('cors');
require('./websocket');

app.use(cors());
/**
 * Create HTTP Server
 */
app.get('/', (req, res) => {
  res.send('test');
});


module.exports = app;

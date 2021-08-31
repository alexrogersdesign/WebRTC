const {v4: uuidV4} = require('uuid'); ;


module.exports = function(io) {
  /**
     * Setup socket connection behaviors
     */
  io.on('connection', (socket) => {
    /**
        * Inform participants that user has joined
        */
    socket.emit('CurrentUserID', socket.id);

    socket.on('NewMeeting', () => {
      socket.emit('NewMeeting', {id: uuidV4()});
    });

    // /**
    //     * Initiate a call to user()
    //     */
    // socket.on('callUser', ({userToCall, signalData, from, name}) => {
    //   console.log(userToCall);
    //   io.to(userToCall).emit('callUser', {signal: signalData, from, name});
    // });

    // /**
    //     * Accept a call from another user
    //     */
    // socket.on('answerCall', (data) => {
    //   io.to(data.to).emit('answerCall', data.signal);
    // });

    // /**
    //     * Inform participants that user has left
    //     */
    // socket.on('close', () => {
    //   socket.broadcast.emit('endcall');
    // });

    // /**
    //   * log socket io errors
    //   */
    // socket.on('connect_error', (err) => {
    //   console.log(`connect_error due to ${err.message}`);
    // });
  });
};


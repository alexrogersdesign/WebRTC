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

    socket.on('JoinRoom', (meetingData) => {
      const {userID, roomID} = meetingData;
      socket.join(roomID);
      socket.to(roomID).broadcast.emit('NewUserConnected', userID);
      socket.on('disconnect', () => {
        socket.to(roomID).broadcast.emit('UserDisconnected', userID);
      });
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


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
      io.to(roomID).emit('NewUserConnected', userID);
      io.on('disconnect', () => {
        socket.to(roomID).emit('UserDisconnected', userID);
      });
    });
  });
};


const {v4: uuidV4} = require('uuid'); ;


module.exports = function(io) {
  /**
  * Setup socket connection behaviors
  */
  io.on('connection', (socket) => {
    socket.emit('CurrentUserID', uuidV4());
    // socket.on('CurrentUserID', () => {
    //   socket.emit('CurrentUserID', uuidV4());
    // });

    socket.on('NewMeeting', () => {
      socket.emit('NewMeeting', {id: uuidV4()});
    });

    socket.on('JoinRoom', (meetingData) => {
      const {userID, roomID} = meetingData;
      socket.join(roomID);
      io.to(roomID).emit('NewUserConnected', userID);
      socket.on('disconnect', () => {
        socket.to(roomID).emit('UserDisconnected', userID);
      });
    });
  });
};


const {v4: uuidV4} = require('uuid'); ;
const userList = [];
const meetingList = {};

module.exports = function(io) {
  /**
  * Setup socket connection behaviors
  */
  io.on('connection', (socket) => {
    const newUserID = uuidV4();
    userList.push(newUserID);
    socket.emit('CurrentUserID', newUserID);

    socket.on('NewMeeting', () => {
      const newMeeting = {
        id: uuidV4(),
        users: [],
      };
      meetingList[newMeeting.id]= newMeeting;
      socket.emit('NewMeeting', newMeeting);
    });

    socket.on('JoinRoom', (meetingData) => {
      const {userID, roomID} = meetingData;
      io.to(roomID).emit('NewUserConnected', userID);
      socket.join(roomID);
      if (roomID in meetingList) meetingList[roomID].users.push(userID);
      socket.on('disconnect', () => {
        socket.to(roomID).emit('UserDisconnected', userID);
      });
    });
  });
};


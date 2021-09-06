const {v4: uuidV4} = require('uuid'); ;
const userList = [];
const meetingList = {};

module.exports = function(io) {
  const createNewMeeting = (id) => {
    const newMeeting = {
      id: id? id : uuidV4(),
      users: [],
    };
    meetingList[newMeeting.id]= newMeeting;
    return newMeeting;
  };

  /**
  * Setup socket connection behaviors
  */
  io.on('connection', (socket) => {
    const newUserID = uuidV4();
    userList.push(newUserID);
    const roomID = socket.handshake.query.room;
    console.log('RoomID', roomID);
    socket.emit('CurrentUserID', newUserID);
    if (roomID) {
      if (!(roomID in meetingList)) {
        socket.emit('NewMeeting', meetingList[roomID]);
      } else {
        socket.emit('NewMeeting', createNewMeeting(roomID) );
      }
    }


    socket.on('NewMeeting', () => {
      socket.emit('NewMeeting', createNewMeeting());
    });

    socket.on('JoinRoom', (meetingData) => {
      const {user, roomID} = meetingData;
      socket.join(roomID);
      io.to(roomID).emit('NewUserConnected', user);
      if (roomID in meetingList) meetingList[roomID].users.push(user);
      socket.on('disconnect', () => {
        socket.to(roomID).emit('UserDisconnected', user);
        // TODO: clean up room attendees.
      });
    });
    // socket.on('LeaveRoom', ())
  });
};


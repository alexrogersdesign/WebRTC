/* jshint esversion: 6 */
/**
 * Holds all of the logic associated with websocket communication.
 */

import {Server, Socket} from "socket.io";
import jwt from "jsonwebtoken";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

import {MeetingModel} from "./database/models.js";
import {findAllMessages, findUser, sendMessageToDatabase} from './database/databaseHelpers.js';

const secretKey = process.env.SECRET_KEY



/**
 * Authentication middleware that retrieves the access token from the
 * socket handshake parameters. The token is decoded and the user
 * information is retrieved from the database.
 * @param {Socket} socket The socket connection
 * @return {User} user The user decoded from the token
 */
const authHandler = async (socket: Socket) => {
  //TODO test expired token refresh
  let { token = null } = socket.handshake.auth || {};
  if (token) {
    try {
      if (Array.isArray(token))
        token = token[0];
      if (!secretKey)
        throw new Error('Missing token or refresh token key');
      const decodedToken = jwt.verify(token, secretKey);
      //* expect decodedToken to be object not string
      if (typeof decodedToken === 'string')
        throw new Error('Token Decode Error');
      const foundUser = await findUser(decodedToken.id);
      if (!foundUser) throw new Error('User does not exist in database')
      return foundUser;
    }
    catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        socket.emit('ExpiredToken')
        console.log('Expired Token', error)
        throw error
      }
      console.log(error)
      socket.disconnect()
      throw error
    }
  }
  socket.emit('error', 'Authentication Token Not Provided')
  socket.disconnect();
};
/**
 * The websocket setup function. Creates socket listeners that implement
 * the SocketIO functionality.
 * @param {Server} io The SocketIO server
 */
const websocket = (io:Server<DefaultEventsMap,DefaultEventsMap>) => {
  const joinRoom = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, roomID:string) => {
      try {
        socket.join(roomID);
        const messages = await findAllMessages(roomID)
        socket.emit('ExistingMessages', messages )
      }
      catch (error){
        console.log('Error when joining room: ', error)
        socket.emit('error', error)
      }
  };
  /*Setup socket connection behaviors*/
  io.on('connection', async (socket) => {
    try {
      const user = await authHandler(socket)
      let roomID: string | null = null
      ;
      //* Get room parameter from url.
      const queryRoom = socket.handshake.query.room;
      if (queryRoom && !Array.isArray(queryRoom) && queryRoom.length) roomID = queryRoom

      /*Check if a room id parameter was supplied
         If so, join that meeting.*/
      if(roomID && roomID !== 'null') await joinRoom(socket, roomID);
      /**
       * Sets up a ChangeStream watcher.
       * This is an event listener that listens for changes in the meeting collection
       * When a change occurs, the socket client is notified.
       * If an error occurs, the watcher is removed and the function is called recursively
       * to restart the watcher.
       */
      (function watchMeetings() {
        console.log('Staring Watcher')
        const watcher = MeetingModel.watch()
            .on('change', (change) => {
              if (change.operationType ===  'delete') {
                io.emit('MeetingDeleted', change.documentKey)
              }
              if (change.operationType ===  'insert') {
                io.emit('MeetingAdded', change.fullDocument)
              }
             })
            .on('error', (error => {
              /** Reboot watcher when an error occurs */
              console.error('Watcher error: ', error)
              watcher.close();
              watchMeetings()
            }))
      })()

      /** The "JoinMeeting" event is used to signal that the client is
       * attempting to join a meeting */
      socket.on('JoinMeeting', (meetingData) => {
        ({roomID} = meetingData);
        if (!roomID) return
        if (socket.rooms.has(roomID)) return;
        io.to(roomID).emit('NewUserConnected', user);
        joinRoom(socket, roomID);
        // TODO add user to meeting attendees
      });
      /**
       * Informs all attendees that the user client has disconnected
       * @param {string} id The room ID
       */
      const leaveRoom = (id: string) => {
        socket.to(id).emit('UserDisconnected', user);
        socket.leave(id)
      };
      /** The "SendMessage" event is used to signal the client is sending a
       * new message to a meeting */
      socket.on('SendMessage', (message) => {
        if (!roomID) return
        sendMessageToDatabase(message);
        io.in(roomID).emit('ReceivedMessage', message);
      });
      /** The "LeaveRoom" event is used to signal the client is leaving the room */
      socket.on('LeaveRoom', () => {
        if (!roomID) return
        leaveRoom(roomID);
      });
      /** The "disconnect" event us used to signal that the client has disconnected */
      socket.on('disconnect', () => {
        if (!roomID) return
        leaveRoom(roomID);
        // TODO: clean up room attendees.
      });
    }
    catch (error){
      console.log(error)
    }

  });
};

export default websocket;

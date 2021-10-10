/* jshint esversion: 6 */

import {Server, Socket} from "socket.io";
import jwt from "jsonwebtoken";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

import {MeetingModel, MessageModel, UserModel} from "./database/models.js";
import {
  IReceivedMeeting,
  IReceivedMessage,
  IReceivedUser,
  parseMeeting,
  parseMessage,
  parseUser
} from "../../frontend/src/util/classParser.js";
import User from "../../frontend/src/shared/classes/User.js";
import Message from "../../frontend/src/shared/classes/Message";
import ObjectID from "bson-objectid";

const secretKey = process.env.SECRET_KEY

const findUser = async (id: string) => {
  const foundUser = await UserModel.findById(id) as unknown as IReceivedUser;
  return parseUser(foundUser);
}
const findMeeting = async (id: string) => {
  const foundMeeting = await MeetingModel.findById(id) as unknown as IReceivedMeeting;
  return parseMeeting(foundMeeting);
}
const findAllMessages = async (meetingId: string): Promise<Message[]>=> {
  const foundMessages = await MessageModel
      .find({meetingId: new ObjectID(meetingId)})
      .populate('user', 'meeting') as unknown as IReceivedMessage[]

  return foundMessages.map((message) => parseMessage(message));
}
const updateMeetingList = async (id:string) => {
  return await findMeeting(id);
};
const sendMessageToDatabase = async (message: IReceivedMessage) => {
  const {id, meetingId, user, contents, type, alt} = parseMessage(message);
  const newMessage = new MessageModel({
    _id: id,
    meetingId,
    user,
    contents,
    type,
    alt,
  });
  return await newMessage.save()
}

const authHandler = async (socket: Socket): Promise<User| undefined>  => {
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
      return findUser(decodedToken.id);
    }
    catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        socket.emit('ExpiredToken')
        console.log('Expired Token', error)
      }
      console.log(error)
      socket.disconnect()
    }
  }
  socket.emit('error', 'Authentication Token Not Provided')
  socket.disconnect();
};
const websocket = (io:Server<DefaultEventsMap,DefaultEventsMap>) => {
  const joinRoom = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, roomID:string) => {
      try {
        // const newMeeting = await updateMeetingList(roomID);
        // socket.emit('NewMeeting', newMeeting);
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
    const newUser = await authHandler(socket)
    //* Send user id (not used)
    socket.emit('CurrentUserID', newUser?.id.toString());
    //* Get room parameter from url.
    const roomID = socket.handshake.query.room;

     /*Check if a room id parameter was supplied
        If so, join that meeting.*/
    if (roomID && roomID !== 'null' && !Array.isArray(roomID)) {
      await joinRoom(socket, roomID);
    }
    socket.on('JoinMeeting', (meetingData) => {
      const {user, roomID} = meetingData;
      if (socket.rooms.has(roomID)) return;
      io.to(roomID).emit('NewUserConnected', user);
      joinRoom(socket, roomID);
      // TODO add user to meeting attendees
      //* Inform attendees if a user disconnects
      const leaveRoom = () => {
        socket.to(roomID).emit('UserDisconnected', user);
      };

      socket.on('SendMessage', (message) => {
        io.in(roomID).emit('ReceivedMessage', message);
        sendMessageToDatabase(message);
      });

      socket.on('LeaveRoom', () => {
        leaveRoom();
      });

      socket.on('disconnect', () => {
        leaveRoom();
        // TODO: clean up room attendees.
      });
    });
  });
};

export default websocket;

/* jshint esversion: 6 */

import {Server, Socket} from "socket.io";
import jwt from "jsonwebtoken";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

import {MeetingModel, MessageModel, UserModel} from "./database/models.js";
import * as classParser from '../../frontend/src/util/classParser.js'
import {
  IReceivedMeeting,
  IReceivedMessage,
  IReceivedUser,
} from '../../frontend/src/util/classParser';
const {
  parseMeeting,
  parseMessage,
  parseUser
} = classParser
import User from "../../frontend/src/shared/classes/User.js";
import Message from "../../frontend/src/shared/classes/Message";
import ObjectID from "bson-objectid";

const secretKey = process.env.SECRET_KEY

const findUser = async (id: string) => {
  try {
  const foundUser = await UserModel.findById(id) as unknown as IReceivedUser;
  return parseUser(foundUser);
  } catch (error) {
    console.log(error)
  }
}
const findMeeting = async (id: string) => {
  try {
  const foundMeeting = await MeetingModel.findById(id) as unknown as IReceivedMeeting;
  return parseMeeting(foundMeeting);
  } catch (error) {
    console.log(error)
  }
}
const findAllMessages = async (meetingId: string): Promise<Message[]>=> {
  try {
  const foundMessages = await MessageModel
      .find({meetingId: new ObjectID(meetingId)})
      .populate('user') as unknown as IReceivedMessage[]
  return foundMessages.map((message) => parseMessage(message));
  } catch (error) {
    throw (error)
  }
}
const updateMeetingList = async (id:string) => {
  return await findMeeting(id);
};
const sendMessageToDatabase = async (message: IReceivedMessage) : Promise<Message> => {
  try {
  const {id, meetingId, user, contents, type, alt} = parseMessage(message);
  const newMessage = new MessageModel({
    _id: id,
    meetingId,
    user: user.id,
    contents,
    type,
    alt,
  });
  return await newMessage.save()
  } catch (error) {
    console.log(error)
    throw error
  }
}

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
      throw error
      socket.disconnect()
    }
  }
  socket.emit('error', 'Authentication Token Not Provided')
  socket.disconnect();
};
const websocket = (io:Server<DefaultEventsMap,DefaultEventsMap>) => {
  const joinRoom = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, roomID:string) => {
      try {
        socket.join(roomID);
        const messages = await findAllMessages(roomID)
        socket.emit('ExistingMessages', messages )
      }
      catch (error){
      /**/  console.log('Error when joining room: ', error)
        socket.emit('error', error)
      }
  };
  /*Setup socket connection behaviors*/
  io.on('connection', async (socket) => {
    try {

      const user = await authHandler(socket)
      //* Send user id (not used)
      socket.emit('CurrentUserID', user?.id.toString());
      let roomID: string | null = null
      ;
      //* Get room parameter from url.
      const queryRoom = socket.handshake.query.room;
      if (queryRoom && !Array.isArray(queryRoom) && queryRoom.length) roomID = queryRoom

      /*Check if a room id parameter was supplied
         If so, join that meeting.*/
      if(roomID && roomID !== 'null') await joinRoom(socket, roomID);

      /* watch for changes in meetings */
        MeetingModel.watch().on('change', (change) => {
        if (change.operationType ===  'delete'){
          io.emit('MeetingDeleted', change._id.id)
        }
        if (change.operationType ===  'insert'){
          io.emit('MeetingAdded', change._id)
        }
      })

      socket.on('JoinMeeting', (meetingData) => {
        ({roomID} = meetingData);
        if (!roomID) return
        if (socket.rooms.has(roomID)) return;
        io.to(roomID).emit('NewUserConnected', user);
        joinRoom(socket, roomID);
        // TODO add user to meeting attendees
        //* Inform attendees if a user disconnects
      });
      const leaveRoom = (id: string) => {
        socket.to(id).emit('UserDisconnected', user);
        socket.leave(id)
      };

      socket.on('SendMessage', (message) => {
        if (!roomID) return
        sendMessageToDatabase(message);
        io.in(roomID).emit('ReceivedMessage', message);
        // socket.to(roomID).emit('ReceivedMessage', message);
      });

      socket.on('LeaveRoom', () => {
        if (!roomID) return
        leaveRoom(roomID);
      });

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

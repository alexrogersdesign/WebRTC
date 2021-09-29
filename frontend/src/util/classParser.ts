import {ObjectId} from 'mongodb';

import Meeting from '../shared/classes/Meeting.js';
import Message,
{MessageImage,
  MessageType,
  Side} from '../shared/classes/Message.js';
import User from '../shared/classes/User.js';
import {RequireAtLeastOne} from '../shared/types';

export interface IReceivedMeeting {
    _id : string | ObjectId,
    _title: string,
    _attendees?: IReceivedUser[];
}

 interface _BaseIReceivedUser {
    _id : string | ObjectId,
    _firstName: string,
    _lastName: string,
}
 interface BaseIReceivedUser {
    id : string | ObjectId,
    firstName: string,
    lastName: string,
}
export type IReceivedUser = _BaseIReceivedUser | BaseIReceivedUser


// eslint-disable-next-line no-unused-vars
// type UserId = RequireAtLeastOne<IReceivedUser, '_id' | 'id'>;
// type UserFirstName = RequireAtLeastOne<IReceivedUser, '_firstName' | 'firstName'>;
// type userLastName = RequireAtLeastOne<IReceivedUser, '_lastName' | 'lastName'>;

export interface IReceivedMessage {
    _meetingId: ObjectId| string,
     _timeStamp: Date,
     _user: IReceivedUser,
     _id: string | ObjectId,
     _contents: string | MessageImage,
     _type?: MessageType,
     _alt?: string,
     _side?: Side,
}

const parseId = (input: string | ObjectId):ObjectId => {
  if (input instanceof ObjectId) {
    return input;
  } else {
    return new ObjectId(input);
  }
};
export const parseUser = (input: IReceivedUser): User => {
  const newId = input.id? input.id: input._id
  const newFirstName = input.firstName? input.firstname: input._firstName
  const newLastName = input.lastName? input.lastName : input._lastname


  const newUser = new User( newId: input._id, newLastName);
  newUser.id = parseId(newId;
  return newUser;
};

const parseAttendees = (input:IReceivedUser[]| undefined): User[] | null => {
  if (!input) return null;
  return input.map((iUser) => parseUser(iUser));
};

export const parseMeeting = (input:IReceivedMeeting): Meeting | undefined => {
  if (!input) return;
  const newMeeting = new Meeting(input._title);
  newMeeting.id = parseId(input._id);
  let attendees;

  if (input['_attendees']) {
    attendees = parseAttendees(input._attendees);
  }
  if (attendees) newMeeting.attendees = attendees;
  return newMeeting;
};

export const parseMessage = (input:IReceivedMessage) : Message => {
  const meetingId = parseId(input._meetingId);
  const userId = parseUser(input._user);
  const newMessage = new Message(meetingId, userId, input._contents );
  newMessage.id = parseId(input._id);
  if (input['_timeStamp']) newMessage.timeStamp = new Date(input._timeStamp);
  if (input['_alt']) newMessage.alt = input._alt;
  if (input['_type']) newMessage.type = input._type;
  if (input['_side']) newMessage.side = input._side;
  return newMessage;
};


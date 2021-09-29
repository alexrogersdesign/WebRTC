import {ObjectId} from 'mongodb';

import Meeting from '../shared/classes/Meeting.js';
import Message,
{MessageImage,
  MessageType} from '../shared/classes/Message.js';
import User from '../shared/classes/User.js';
// import {RequireAtLeastOne} from '../shared/types';

export interface _BaseIReceivedMeeting {
    _id : string | ObjectId,
    _title: string,
    _attendees?: IReceivedUser[];
}
export interface BaseIReceivedMeeting {
    id : string | ObjectId,
    title: string,
    attendees?: IReceivedUser[];
}
export type IReceivedMeeting = BaseIReceivedMeeting & _BaseIReceivedMeeting

 type _BaseIReceivedUser = {
    _id : string | ObjectId,
    _firstName: string,
    _lastName: string,
    _email: string

}
 type BaseIReceivedUser = {
    id : string | ObjectId,
    firstName: string,
    lastName: string,
    email: string
}
export type IReceivedUser = _BaseIReceivedUser & BaseIReceivedUser

export interface BaseIReceivedMessage {
     meetingId: ObjectId| string,
     timeStamp: Date,
     user: IReceivedUser,
     id: string | ObjectId,
     contents: string | MessageImage,
     type?: MessageType,
     alt?: string,
}
export interface _BaseIReceivedMessage {
    _meetingId: ObjectId| string,
    _timeStamp: Date,
    _user: IReceivedUser,
    _id: string | ObjectId,
    _contents: string | MessageImage,
    _type?: MessageType,
    _alt?: string,
}
export type IReceivedMessage = BaseIReceivedMessage & _BaseIReceivedMessage

const parseId = (input: string | ObjectId):ObjectId => {
  if (input instanceof ObjectId) {
    return input;
  } else {
    return new ObjectId(input);
  }
};
export const parseUser = (input: IReceivedUser): User => {
  const newId = input.id? input.id: input._id;
  const newFirstName = input.firstName? input.firstName: input._firstName;
  const newLastName = input.lastName? input.lastName : input._lastName;
  const newEmail = input.email? input.email : input._email;
  const newUser = new User(newFirstName, newLastName, newEmail);
  newUser.id = parseId(newId);
  return newUser;
};

const parseAttendees = (input:IReceivedUser[]| undefined): User[] | null => {
  if (!input) return null;
  return input.map((iUser) => parseUser(iUser));
};

export const parseMeeting = (input:IReceivedMeeting): Meeting | undefined => {
  if (!input) return;
  const newTitle = input.title? input.title : input._title;
  const newId = input.id? input.id : input._id;
  const newMeeting = new Meeting(newTitle);
  newMeeting.id = parseId(newId);
  let attendees;

  if (input['_attendees']) {
    attendees = parseAttendees(input._attendees);
  }
  if (attendees) newMeeting.attendees = attendees;
  return newMeeting;
};

export const parseMessage = (input:IReceivedMessage) : Message => {
  const newId = parseId(input.id? input.id : input._id);
  const newContents = input.contents? input.contents : input._contents;
  const newMeetingId = parseId(input.meetingId?
     input.meetingId :
     input._meetingId);
  const newUser= parseUser(input.user? input.user : input._user);
  const newMessage = new Message(newMeetingId, newUser, newContents );
  const newAlt = input.alt? input.alt : input._alt;
  const newType = input.type? input.type : input._type;
  newMessage.id = newId;
  if (newAlt) newMessage.alt = newAlt;
  if (newType) newMessage.type = newType;
  return newMessage;
};


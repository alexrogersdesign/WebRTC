import ObjectID from 'bson-objectid';

import Meeting from '../shared/classes/Meeting.js';
import Message,
{MessageImage,
  MessageType} from '../shared/classes/Message.js';
import User from '../shared/classes/User.js';
// import {RequireAtLeastOne} from '../shared/types';

export interface _BaseIReceivedMeeting {
    _id : string | ObjectID,
    _title: string,
    _description: string,
    _start: string,
    _end: string,
    _attendees?: IReceivedUser[];
}
export interface BaseIReceivedMeeting {
    id : string | ObjectID,
    title: string,
    description: string,
    start: string,
    end: string,
    attendees?: IReceivedUser[];
}
export type IReceivedMeeting = BaseIReceivedMeeting & _BaseIReceivedMeeting

 type _BaseIReceivedUser = {
    _id : string | ObjectID,
    _firstName: string,
    _lastName: string,
    _email: string

}
 type BaseIReceivedUser = {
    id : string | ObjectID,
    firstName: string,
    lastName: string,
    email: string
}
export type IReceivedUser = _BaseIReceivedUser & BaseIReceivedUser

export interface BaseIReceivedMessage {
     meetingId: ObjectID| string,
     user: IReceivedUser,
     id: string | ObjectID,
     contents: string | MessageImage,
     type?: MessageType,
     alt?: string,
}
export interface _BaseIReceivedMessage {
    _meetingId: ObjectID| string,
    _user: IReceivedUser,
    _id: string | ObjectID,
    _contents: string | MessageImage,
    _type?: MessageType,
    _alt?: string,
}
export type IReceivedMessage = BaseIReceivedMessage & _BaseIReceivedMessage

const parseId = (input: string | ObjectID):ObjectID => {
  if (input instanceof ObjectID) {
    return input;
  } else {
    return new ObjectID(input);
  }
};
export const parseUser = (input: IReceivedUser): User => {
  const newId = input.id?? input._id;
  const newFirstName = input.firstName?? input._firstName;
  const newLastName = input.lastName?? input._lastName;
  const newEmail = input.email?? input._email;
  const newUser = new User(newFirstName, newLastName, newEmail);
  newUser.id = parseId(newId);
  return newUser;
};

const parseAttendees = (input:IReceivedUser[]| undefined): User[] | null => {
  if (!input) return null;
  return input.map((iUser) => parseUser(iUser));
};

export const parseMeeting = (input:IReceivedMeeting): Meeting => {
  const newTitle = input.title?? input._title;
  const newId = parseId(input.id?? input._id);
  const newStart = new Date(input.start?? input._start);
  const newEnd = new Date(input.end?? input._end);
  const newDescription = input.description?? input._description;
  const newMeeting = new Meeting(
      newTitle,
      newDescription,
      newStart,
      newEnd,
      newId);
  let attendees;
  if (input['_attendees']) {
    attendees = parseAttendees(input._attendees);
  }
  if (attendees) newMeeting.attendees = attendees;
  return newMeeting;
};

export const parseMessage = (input:IReceivedMessage) : Message => {
  const newId = parseId(input.id?? input._id);
  const newContents = input.contents?? input._contents;
  const newMeetingId = parseId(input.meetingId?? input._meetingId);
  const newUser= parseUser(input.user?? input._user);
  const newMessage = new Message(newMeetingId, newUser, newContents, newId );
  const newAlt = input.alt?? input._alt;
  const newType = input.type?? input._type;
  if (newAlt) newMessage.alt = newAlt;
  if (newType) newMessage.type = newType;
  return newMessage;
};


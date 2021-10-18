// global.Buffer = global.Buffer || require('buffer').Buffer;
import ObjectID from 'bson-objectid';
import {Buffer} from 'buffer';
import Meeting from '../shared/classes/Meeting.js';
import Message,
{MessageImage,
  MessageType} from '../shared/classes/Message.js';
import User from '../shared/classes/User.js';
// import {MeetingIcon} from '../shared/classes/MeetingIcon.js';
// import {RequireAtLeastOne} from '../shared/types';

export interface _BaseIReceivedMeeting {
    _id : string | ObjectID,
    _title: string,
    _description: string,
    _start: string,
    _end: string,
    // _icon?: IReceivedMeetingIcon,
    _icon?: ImageBuffer,
    _attendees?: IReceivedUser[];
}
export interface BaseIReceivedMeeting {
    id : string | ObjectID,
    title: string,
    description: string,
    start: string,
    end: string,
    // icon?: IReceivedMeetingIcon,
    icon?: ImageBuffer,
    attendees?: IReceivedUser[];
}
export type IReceivedMeeting = BaseIReceivedMeeting & _BaseIReceivedMeeting

 type _BaseIReceivedUser = {
    _id : string | ObjectID,
    _firstName: string,
    _lastName: string,
    _email: string,
    _icon?: ImageBuffer,
 }
 type BaseIReceivedUser = {
    id : string | ObjectID,
    firstName: string,
    lastName: string,
    email: string,
    icon?: ImageBuffer,
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
  const newId = parseId(input.id?? input._id);
  const newFirstName = input.firstName?? input._firstName;
  const newLastName = input.lastName?? input._lastName;
  const newEmail = input.email?? input._email;
  const newIcon = parseBuffer(input.icon?? input._icon);
  const newUser = new User(newFirstName, newLastName, newEmail, newId, newIcon);
  return newUser;
};

const parseAttendees = (input:IReceivedUser[]| undefined): User[] | null => {
  if (!input) return null;
  return input.map((iUser) => parseUser(iUser));
};

export interface BaseIReceivedImage {
     id: ObjectID| string,
     image: string,
}
export interface _BaseIReceivedImage {
    _id: ObjectID| string,
    _image: string,
}

export interface BaseIReceivedMeetingIcon extends BaseIReceivedImage{
    meetingId: ObjectID| string,
}
export interface _BaseIReceivedMeetingIcon extends _BaseIReceivedImage{
    _meetingId: ObjectID| string,
}

export type IReceivedMeetingIcon =
    BaseIReceivedMeetingIcon &
    _BaseIReceivedMeetingIcon;

// export const parseMeetingIcon =
//     (input: IReceivedMeetingIcon |undefined): MeetingIcon| undefined => {
//       if (!input) return;
//       const newId = parseId(input.id?? input._id);
//       const newImage = input.image?? input._image;
//       const newMeetingId = parseId(input.meetingId?? input._meetingId);
//       return new MeetingIcon(newImage, newId, newMeetingId);
//     };

interface ImageBuffer {
    data: Buffer,
    mimeType: string
}
type ParseBuffer = ImageBuffer| string | undefined

const parseBuffer = (input: ParseBuffer): string | undefined => {
  if (!input) return;
  if (typeof input === 'string') return input;
  // console.log('buffer input', input);
  const buffer = Buffer.from(input.data);
  const bufferString = buffer.toString('base64');
  const dataString = `data:${input.mimeType};base64,${bufferString}`;
  return dataString;
};

export const parseMeeting =
    (input:IReceivedMeeting, icon?: ImageBuffer): Meeting => {
      const newTitle = input.title?? input._title;
      const newId = parseId(input.id?? input._id);
      const newStart = new Date(input.start?? input._start);
      const newEnd = new Date(input.end?? input._end);
      const newDescription = input.description?? input._description;
      const newIcon = parseBuffer(input.icon?? input._icon);
      const newMeeting = new Meeting(
          newTitle,
          newDescription,
          newStart,
          newEnd,
          newId,
          newIcon,
      );
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


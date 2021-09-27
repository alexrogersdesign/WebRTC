import Meeting from '../../shared/classes/Meeting';
import Message,
{MessageImage,
  MessageType,
  Side} from '../../shared/classes/Message';
import User from '../../shared/classes/User';

export interface IReceivedMeeting {
    _id : string,
    _title: string,
    _attendees?: IReceivedUser[];
}
export interface IReceivedUser {
    _id : string,
    _firstName: string,
    _lastName: string,
}
export interface IReceivedMessage {
     _timeStamp: Date,
     _user: IReceivedUser,
     _id: string,
     _contents: string | MessageImage,
     _type?: MessageType,
     _alt?: string,
     _side?: Side,
}
export const parseUser = (iUser: IReceivedUser): User => {
  return new User(iUser._id, iUser._firstName, iUser._lastName);
};

const parseAttendees = (input:IReceivedUser[]| undefined): User[] | null => {
  if (!input) return null;
  return input.map((iUser) => parseUser(iUser));
};

export const parseMeeting = (input:IReceivedMeeting): Meeting | undefined => {
  if (!input) return;
  const newMeeting = new Meeting(input._id, input._title);
  let attendees;
  if (input['_attendees']) {
    attendees = parseAttendees(input._attendees);
  }
  if (attendees) newMeeting.attendees = attendees;
  return newMeeting;
};

export const parseMessage = (input:IReceivedMessage) : Message => {
  const newMessage = new Message(parseUser(input._user), input._contents );
  if (input['_timeStamp']) newMessage.timeStamp = new Date(input._timeStamp);
  if (input['_alt']) newMessage.alt = input._alt;
  if (input['_type']) newMessage.type = input._type;
  if (input['_side']) newMessage.side = input._side;
  return newMessage;
};


import User from '../../shared/classes/User';
import Meeting from '../../shared/classes/Meeting';

export interface IReceivedMeeting {
    _id : string,
    _title: string,
    _attendees: IReceivedUser[];
}
export interface IReceivedUser {
    _id : string,
    _firstName: string,
    _lastName: string,
}
export const parseUser = (iUser: IReceivedUser): User => {
  return new User(iUser._id, iUser._firstName, iUser._lastName);
};

const parseAttendees = (input:IReceivedUser[]): User[] => {
  return input.map((iUser) => parseUser(iUser));
};

export const parseMeeting = (input:IReceivedMeeting): Meeting => {
  const attendees = parseAttendees(input._attendees);
  return new Meeting(input._id, input._title, attendees);
};

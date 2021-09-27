import User from './User';
/**
 * The meeting class representing the information about an existing meeting.
 */
export default class Meeting {
    private _id;
    private _title;
    private _attendees;
    /**
   * The class constructor
   * @param {String} id the meeting id
   * @param {String} title the meeting title
   * @param {User[]} users optional list of users
   */
    constructor(id: string, title: string, users?: User[]);
    /**
   * Adds a user to the attendee list
   * @param {User} user the user to add
   */
    addAttendee(user: User): void;
    /**
   * @override to string method
   */
    toString(): string;
    /**
   * returns the meeting id
   */
    get id(): string;
    /**
   * sets the meeting id
   * @param {String} value the new meeting id
   */
    set id(value: string);
    /**
   * returns the meeting title
   */
    get title(): string;
    /**
   * set the meeting title
   * @param {String} value the new meeting title
   */
    set title(value: string);
    /**
   * returns the array of attendees
   */
    get attendees(): User[];
    /**
   * sets all of the attendees
   * @param {User[]} value an array of users
   */
    set attendees(value: User[]);
}

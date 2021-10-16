import ObjectID from 'bson-objectid';

import User from './User';
// eslint-disable-next-line no-unused-vars
// import {MeetingIcon} from './MeetingIcon';
/**
 * The meeting class representing the information about an existing meeting.
 */
export default class Meeting {
    _id: ObjectID;
    private _title: string;
    private _description: string;
    private _attendees: User[];
    private _start: Date;
    private _end: Date;
    private _icon: string | undefined;

    /**
     * The class constructor
     * @param {string} title the meeting title
     * @param {string} description the meeting description
     * @param {Date} start the start time of the meeting
     * @param {Date} end the end time of the meeting
     * @param {ObjectID} id an optional bson object ID
     * @param {string} icon the meeting icon as image string
     */
    constructor(
        title: string,
        description: string,
        start: Date,
        end: Date,
        id?: ObjectID,
        icon?: string,
    ) {
      this._id = id?? new ObjectID();
      this._title = title;
      this._description = description;
      this._start = start;
      this._end = end;
      this._icon = icon;
      this._attendees = [];
    }

    /**
   * Adds a user to the attendee list
   * @param {User} user the user to add≤
   */
    addAttendee(user:User) {
      const found = this._attendees.indexOf(user);
      !found && this._attendees.push(user);
    }

    /**
   * @override to string method
   */
    toString() {
      return this._title;
    }

    /**
   * returns the meeting id
   */
    get id(): ObjectID {
      return this._id;
    }

    /**
   * sets the meeting id
   * @param {String} value the new meeting id
   */
    set id(value: ObjectID) {
      this._id = value;
    }

    /**
   * returns the meeting title
   */
    get title(): string {
      return this._title;
    }

    /**
   * set the meeting title
   * @param {String} value the new meeting title
   */
    set title(value: string) {
      this._title = value;
    }

    /**
   * returns the array of attendees
   */
    get attendees(): User[] {
      return this._attendees;
    }

    /**
     * sets all of the attendees
     * @param {User[]} value an array of users
     */
    set attendees(value: User[]) {
      this._attendees = value;
    }
    /**
     * gets the meeting description.
     */
    get description(): string {
      return this._description;
    }
    /**
     * sets the meeting description.
     * @param {String} value an array of users
     */
    set description(value: string) {
      this._description = value;
    }
    /**
     * gets the meeting start.
     */
    get start(): Date {
      return this._start;
    }
    /**
     * sets the meeting start.
     * @param {Date} value the meeting start Date object
     */
    set start(value: Date ) {
      this._start = value;
    }
    /**
     * gets the meeting end.
     */
    get end(): Date {
      return this._end;
    }
    /**
     * sets the meeting end.
     * @param {Date} value the meeting end Date object
     */
    set end(value: Date ) {
      this._end = value;
    }
    /**
     * gets the icon image as a string.
     */
    get icon(): string | undefined {
      return this._icon;
    }
    /**
     * sets the meeting Icon.
     * @param {String | undefined} value the icon image as a string
     */
    set icon(value: string | undefined) {
      this._icon = value;
    }
}

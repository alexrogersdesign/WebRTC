/**
 * The meeting class representing the information about an existing meeting.
 */
export default class Meeting {
    _id;
    _title;
    _attendees;
    /**
   * The class constructor
   * @param {String} id the meeting id
   * @param {String} title the meeting title
   * @param {User[]} users optional list of users
   */
    constructor(id, title, users) {
        this._id = id;
        this._title = title;
        this._attendees = users ? users : [];
    }
    /**
   * Adds a user to the attendee list
   * @param {User} user the user to add
   */
    addAttendee(user) {
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
    get id() {
        return this._id;
    }
    /**
   * sets the meeting id
   * @param {String} value the new meeting id
   */
    set id(value) {
        this._id = value;
    }
    /**
   * returns the meeting title
   */
    get title() {
        return this._title;
    }
    /**
   * set the meeting title
   * @param {String} value the new meeting title
   */
    set title(value) {
        this._title = value;
    }
    /**
   * returns the array of attendees
   */
    get attendees() {
        return this._attendees;
    }
    /**
   * sets all of the attendees
   * @param {User[]} value an array of users
   */
    set attendees(value) {
        this._attendees = value;
    }
}

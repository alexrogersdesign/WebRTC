"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The meeting class representing the information about an existing meeting.
 */
var Meeting = /** @class */ (function () {
    /**
   * The class constructor
   * @param {String} id the meeting id
   * @param {String} title the meeting title
   * @param {User[]} users optional list of users
   */
    function Meeting(id, title, users) {
        this._id = id;
        this._title = title;
        this._attendees = users ? users : [];
    }
    /**
   * Adds a user to the attendee list
   * @param {User} user the user to add
   */
    Meeting.prototype.addAttendee = function (user) {
        var found = this._attendees.indexOf(user);
        !found && this._attendees.push(user);
    };
    /**
   * @override to string method
   */
    Meeting.prototype.toString = function () {
        return this._title;
    };
    Object.defineProperty(Meeting.prototype, "id", {
        /**
       * returns the meeting id
       */
        get: function () {
            return this._id;
        },
        /**
       * sets the meeting id
       * @param {String} value the new meeting id
       */
        set: function (value) {
            this._id = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Meeting.prototype, "title", {
        /**
       * returns the meeting title
       */
        get: function () {
            return this._title;
        },
        /**
       * set the meeting title
       * @param {String} value the new meeting title
       */
        set: function (value) {
            this._title = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Meeting.prototype, "attendees", {
        /**
       * returns the array of attendees
       */
        get: function () {
            return this._attendees;
        },
        /**
       * sets all of the attendees
       * @param {User[]} value an array of users
       */
        set: function (value) {
            this._attendees = value;
        },
        enumerable: false,
        configurable: true
    });
    return Meeting;
}());
exports.default = Meeting;

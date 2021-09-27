"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A user class
 */
var User = /** @class */ (function () {
    /**
     * @param {string} id User ID
     * @param {_firstName} firstName First name
     * @param {_lastName} lastName Last name
     */
    function User(id, firstName, lastName) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this.updateFullName();
    }
    /**
   * helper function to update the full name variable
   * @private since it is only used internally
   */
    User.prototype.updateFullName = function () {
        this._fullName = this._firstName + " " + this._lastName;
    };
    /** `
     * @override toString method
     * @return {string} Users full name
     */
    User.prototype.toString = function () {
        return this._fullName;
    };
    /**
     * @param {User} user the user to compare
   * @override strict comparison
   * @return {string} Users full name
   */
    User.prototype.equals = function (user) {
        return user.id === this.id;
    };
    Object.defineProperty(User.prototype, "fullName", {
        /**
         * returns fullName
         */
        get: function () {
            return this._fullName ? this._fullName : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "id", {
        /**
         * returns ID
         */
        get: function () {
            return this._id;
        },
        /**
       * sets id
       * @param {String} value the new id
       */
        set: function (value) {
            this._id = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "firstName", {
        /**
         * returns firstName
         */
        get: function () {
            return this._firstName ? this._firstName : '';
        },
        /**
         * sets firstName
         * @param {String} value the new first name
         */
        set: function (value) {
            this._firstName = value;
            this.updateFullName();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "lastName", {
        /**
         * returns lastName
         */
        get: function () {
            return this._lastName ? this._lastName : '';
        },
        /**
         * sets lastName
         * @param {String} value the new last name
         */
        set: function (value) {
            this._lastName = value;
            this.updateFullName();
        },
        enumerable: false,
        configurable: true
    });
    return User;
}());
exports.default = User;

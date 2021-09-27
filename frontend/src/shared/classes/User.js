/**
 * A user class
 */
export default class User {
    _id;
    _firstName;
    _lastName;
    _fullName;
    /**
     * @param {string} id User ID
     * @param {_firstName} firstName First name
     * @param {_lastName} lastName Last name
     */
    constructor(id, firstName, lastName) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this.updateFullName();
    }
    /**
   * helper function to update the full name variable
   * @private since it is only used internally
   */
    updateFullName() {
        this._fullName = `${this._firstName} ${this._lastName}`;
    }
    /** `
     * @override toString method
     * @return {string} Users full name
     */
    toString() {
        return this._fullName;
    }
    /**
     * @param {User} user the user to compare
   * @override strict comparison
   * @return {string} Users full name
   */
    equals(user) {
        return user.id === this.id;
    }
    /**
     * returns fullName
     */
    get fullName() {
        return this._fullName ? this._fullName : '';
    }
    /**
     * returns ID
     */
    get id() {
        return this._id;
    }
    /**
     * returns firstName
     */
    get firstName() {
        return this._firstName ? this._firstName : '';
    }
    /**
     * returns lastName
     */
    get lastName() {
        return this._lastName ? this._lastName : '';
    }
    /**
   * sets id
   * @param {String} value the new id
   */
    set id(value) {
        this._id = value;
    }
    /**
     * sets lastName
     * @param {String} value the new last name
     */
    set lastName(value) {
        this._lastName = value;
        this.updateFullName();
    }
    /**
     * sets firstName
     * @param {String} value the new first name
     */
    set firstName(value) {
        this._firstName = value;
        this.updateFullName();
    }
}

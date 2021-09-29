import {ObjectId} from 'mongodb';

/**
 * A user class
 */
export default class User {
     _id: ObjectId;
    private _firstName?: string;
    private _lastName?: string;
    private _fullName?: string;

    /**
     * @param {_firstName} firstName First name
     * @param {_lastName} lastName Last name
     */
    constructor(
        firstName: string,
        lastName: string,
    ) {
      this._id = new ObjectId();
      this._firstName = firstName;
      this._lastName = lastName;
      this.updateFullName();
    }

    /**
   * helper function to update the full name variable
   * @private since it is only used internally
   */
    private updateFullName() {
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
    equals(user:User) {
      return user.id === this.id;
    }

    /**
     * returns fullName
     */
    get fullName(): string {
      return this._fullName? this._fullName : '';
    }

    /**
     * returns ID
     */
    get id(): ObjectId {
      return this._id;
    }
    /**
     * returns firstName
     */
    get firstName(): string {
      return this._firstName? this._firstName : '';
    }
    /**
     * returns lastName
     */
    get lastName(): string {
      return this._lastName? this._lastName: '';
    }

    /**
   * sets id
   * @param {String} value the new id
   */
    set id(value: ObjectId) {
      this._id = value;
    }
    /**
     * sets lastName
     * @param {String} value the new last name
     */
    set lastName(value: string) {
      this._lastName = value;
      this.updateFullName();
    }
    /**
     * sets firstName
     * @param {String} value the new first name
     */
    set firstName(value: string) {
      this._firstName = value;
      this.updateFullName();
    }
}


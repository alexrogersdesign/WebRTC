import ObjectID from 'bson-objectid';

/**
 * A user class
 */
export default class User {
     _id: ObjectID;
    private _firstName?: string;
    private _lastName?: string;
    private _fullName?: string;
    private _email?: string;
    private _icon: string | undefined;

    /**
     * @param {_firstName} firstName First name
     * @param {_lastName} lastName Last name
     * @param {_email} email email
     * @param {ObjectID} id an optional bson object ID
     * @param {string} icon the user icon as image string
     */
    constructor(
        firstName: string,
        lastName: string,
        email: string,
        id?: ObjectID,
        icon?: string,
    ) {
      this._id = id?? new ObjectID();
      this._firstName = firstName;
      this._lastName = lastName;
      this._email = email;
      this._icon = icon;
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
    get id(): ObjectID {
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
     * returns email
     */
    get email(): string {
      return this._email? this._email : '';
    }
    /**
     * sets email
     * @param {string} input email address
     */
    set email(input: string) {
      this._email = input;
    }

    /**
   * sets id
   * @param {String} value the new id
   */
    set id(value: ObjectID) {
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


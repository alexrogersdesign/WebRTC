/**
 * A user class
 */
export default class User {
    private _id;
    private _firstName?;
    private _lastName?;
    private _fullName?;
    /**
     * @param {string} id User ID
     * @param {_firstName} firstName First name
     * @param {_lastName} lastName Last name
     */
    constructor(id: string, firstName: string, lastName: string);
    /**
   * helper function to update the full name variable
   * @private since it is only used internally
   */
    private updateFullName;
    /** `
     * @override toString method
     * @return {string} Users full name
     */
    toString(): string | undefined;
    /**
     * @param {User} user the user to compare
   * @override strict comparison
   * @return {string} Users full name
   */
    equals(user: User): boolean;
    /**
     * returns fullName
     */
    get fullName(): string;
    /**
     * returns ID
     */
    get id(): string;
    /**
     * returns firstName
     */
    get firstName(): string;
    /**
     * returns lastName
     */
    get lastName(): string;
    /**
   * sets id
   * @param {String} value the new id
   */
    set id(value: string);
    /**
     * sets lastName
     * @param {String} value the new last name
     */
    set lastName(value: string);
    /**
     * sets firstName
     * @param {String} value the new first name
     */
    set firstName(value: string);
}

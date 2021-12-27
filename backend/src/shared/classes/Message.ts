/* eslint-disable require-jsdoc */
import ObjectID from 'bson-objectid';

import User from './User.js';

export type Side = 'left' | 'right'
export type MessageType = 'image' | 'text'
export interface MessageImage {
  image: MediaImage,
  alt: string,
}

/**
 * The class representing a chat message
 */
export default class Message {
   _id: ObjectID;
  private _meetingId: ObjectID;
  private _user: User;
  private _contents: string | MessageImage;
  private _type?: MessageType;
  private _alt?: string;
  private _side?: Side;

  /**
   * Constructor
   * @param {ObjectID} meetingId The ID of the meeting
   * @param {User} user The User object who created the message
   * @param {String} contents The contents of the meeting
   * @param {ObjectID} id The ID of the messages
   * @param {String} alt The alt text of the message
   */
  constructor(
      meetingId: ObjectID,
      user: User,
      contents: string | MessageImage,
      id: ObjectID = new ObjectID(),
      alt: string = `message from ${user}`,
  ) {
    this._meetingId = meetingId;
    this._id = id;
    this._user = user;
    this._contents = contents;
    this._type = typeof contents === 'string'? 'text': 'image';
    this._alt = alt;
  }

  get timeStamp(): Date {
    /* Casting due to improper typing supplied by module,
    * actual return from getTimestamp() is a Date Object*/
    return this._id.getTimestamp() as unknown as Date;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get id(): ObjectID {
    return this._id;
  }

  set id(value: ObjectID) {
    this._id = value;
  }

  get meetingId(): ObjectID {
    return this._meetingId;
  }

  set meetingId(value: ObjectID) {
    this._meetingId = value;
  }

  get contents(): string | MessageImage {
    return this._contents;
  }

  set contents(value: string | MessageImage) {
    this._contents = value;
  }

  get type(): MessageType {
    return <'image' | 'text'> this._type;
  }

  set type(value: MessageType) {
    this._type = value;
  }

  get alt(): string {
    return <string> this._alt;
  }

  set alt(value: string) {
    this._alt = value;
  }

  get side(): Side {
    return <'left' | 'right'> this._side;
  }

  set side(value: Side) {
    this._side = value;
  }
}

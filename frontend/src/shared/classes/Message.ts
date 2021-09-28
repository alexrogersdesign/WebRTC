/* eslint-disable require-jsdoc */
import {ObjectId} from 'mongodb';

import User from './User';

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
   _id: ObjectId;
  private _timeStamp: Date;
  private _meetingId: ObjectId;
  private _user: User;
  private _contents: string | MessageImage;
  private _type?: MessageType;
  private _alt?: string;
  private _side?: Side;

  /**
   * Constructor
   * @param {ObjectId} meetingId
   * @param {User} user
   * @param {String} contents
   * @param {Side} side
   * @param {String} alt
   */
  constructor(
      meetingId: ObjectId,
      user: User,
      contents: string | MessageImage,
      side: Side = 'left',
      alt: string = `message from ${user}`,
  ) {
    this._meetingId = meetingId;
    this._id = new ObjectId();
    this._timeStamp = this._id.getTimestamp();
    this._user = user;
    this._contents = contents;
    this._type = typeof contents === 'string'? 'text': 'image';
    this._alt = alt;
    this._side = side;
  }

  get timeStamp(): Date {
    return this._timeStamp;
  }

  set timeStamp(value: Date) {
    this._timeStamp = value;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get id(): ObjectId {
    return this._id;
  }

  set id(value: ObjectId) {
    this._id = value;
  }

  get meetingId(): ObjectId {
    return this._meetingId;
  }

  set meetingId(value: ObjectId) {
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

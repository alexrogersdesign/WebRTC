/* eslint-disable require-jsdoc */
import User from './User';
import {v4 as uuidV4} from 'uuid';

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
  private _timeStamp: Date;
  private _user: User;
  private _id: string;
  private _contents: string | MessageImage;
  private _type?: MessageType;
  private _alt?: string;
  private _side?: Side;

  /**
   * Constructor
   * @param {User} user
   * @param {String} contents
   * @param {Side} side
   * @param {String} alt
   */
  constructor(user: User,
      contents: string | MessageImage,
      side: Side = 'left',
      alt: string = `message from ${user}`,
  ) {
    this._timeStamp = new Date();
    this._user = user;
    this._id = uuidV4();
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

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
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

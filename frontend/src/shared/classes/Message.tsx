import User from './User';
import {MessageImage, MessageType, Side} from '../types';

/**
 * The class representing a chat message
 */
export default class Message {
  timeStamp: Date;
  user: User;
  id: string;
  contents: string | MessageImage;
  type?: MessageType;
  alt?: string;
  side?: Side;
}

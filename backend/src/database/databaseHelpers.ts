import ObjectID from 'bson-objectid';

import {
  IReceivedMeeting,
  IReceivedMessage,
  IReceivedUser,
  parseMeeting,
  parseMessage,
  parseUser,
} from '../shared/util/classParser.js';
import {MeetingModel, MessageModel, UserModel} from './models.js';
import Message from '../shared/classes/Message.js';

/**
 * Attempts to retrieve the user from the database. Throws an error if not found
 * @param {string} id The user ID
 * @return {Promise<User>} The found user
 */
export const findUser = async (id: string) => {
  try {
    const foundUser = await UserModel.findById(id) as unknown as IReceivedUser;
    return parseUser(foundUser);
  } catch (error) {
    console.log(error)
  }
}
/**
 * Attempts to retrieve the meeting from the database. Throws an error if not found
 * @param {string} id The meeting ID
 * @return {Promise<Meeting>} The found meeting
 */
export const findMeeting = async (id: string) => {
  try {
    const foundMeeting = await MeetingModel.findById(id) as unknown as IReceivedMeeting;
    return parseMeeting(foundMeeting);
  } catch (error) {
    console.log(error)
  }
}

/**
 * Attempts to retrieve the messages associated with a specific meeting
 * from the database.
 * @param {string} meetingId The meeting ID
 * @return {Promise<Meeting>} The found messages
 */
export const findAllMessages = async (meetingId: string): Promise<Message[]>=> {
  try {
    const foundMessages = await MessageModel
      .find({meetingId: new ObjectID(meetingId)})
      .populate('user') as unknown as IReceivedMessage[]
    return foundMessages.map((message) => parseMessage(message));
  } catch (error) {
    throw (error)
  }
}


/**
 * Uploads message to the database.
 * @param {IReceivedMessage} message The message to upload
 * @return {Promise<Message>} The uploaded message
 */
export const sendMessageToDatabase = async (message: IReceivedMessage) : Promise<Message> => {
  try {
    const {id, meetingId, user, contents, type, alt} = parseMessage(message);
    const newMessage = new MessageModel({
      _id: id,
      meetingId,
      user: user.id,
      contents,
      type,
      alt,
    });
    return await newMessage.save()
  } catch (error) {
    console.log(error)
    throw error
  }
}

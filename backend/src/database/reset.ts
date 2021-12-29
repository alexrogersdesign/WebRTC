import {fileTypeFromBuffer} from 'file-type';
import {Model} from 'mongoose';
import ObjectID from 'bson-objectid';
import * as dotenv from 'dotenv'


import {MeetingModel, MessageModel, UserModel} from './models.js';
import Meeting from '../shared/classes/Meeting.js';
import Message, {MessageImage} from '../shared/classes/Message.js';
import {generateManyMeetings, generateManyMessages} from '../shared/util/templateData.js';
import {stripData} from '../shared/util/helpers.js';
import {demoUsers} from '../shared/demoItemsNode.js';
import User from '../shared/classes/User.js';
import database, {disconnect} from './database.js';


dotenv.config()

type UploadableItem = Meeting | Message | User
type ModelType = Model<Meeting> | Model<Message> | Model<User>

/**
 * Processes an icon image into the format expected by the database
 * @param {string} iconString The icon image buffer encoded as a 'Base64' string
 * @return {Promise<{data: Buffer, mimeType: string}>} The processed icon
 */
const processIcon = async (iconString?: string) => {
  if (iconString) {
    const iconBuffer = Buffer.from(iconString, "base64")
    const bufferType = await fileTypeFromBuffer(iconBuffer)
    return {
      data: iconBuffer,
      mimeType: bufferType?.mime,
    }
  }
}

/**
 * Uploads items to the database.
 * @param {ModelType} model Mongoose model representing the data to upload
 * @param {Array<UploadableItem>} items An array of items to upload
 * @return {Promise<void>}
 */
async function upload(model: ModelType, items: Array<UploadableItem>) {
  try {
  for await (const itemObject of items) {
    const item = stripData(itemObject);
    let icon: string | undefined;
    const {id,...rest} = item;
    if ('icon' in item) icon = item.icon;
    const processedIcon = await processIcon(icon)
    const doc = new model({
      ...rest,
      _id: id?? new ObjectID(),
      user: rest.user?._id,
      icon: processedIcon,
    })
    await doc.save()
  }

  } catch (error) {
    console.error(error);
  }
}

/**
 * Resets the database to by removing preexisting data and replacing
 * it with newly generated demo data.
 * @return {Promise<void>}
 */
async function reset() {
  /** Load the database connection */
  await database(process.env.FULL_DB_CONN_STRING);
  /** Delete all demo users */
  for (const user of demoUsers) {
    await UserModel.findByIdAndDelete(user.id);
  }
  /** Replace demo users */
  await upload(UserModel, demoUsers)
  /** Delete all existing meetings */
  await MeetingModel.deleteMany({})
  await MessageModel.deleteMany({})
  const newMeetings = generateManyMeetings(5)
  /** Upload new generated meetings */
  await upload(MeetingModel, newMeetings)
  /** Generate new messages for each meeting and upload them*/
  for (const meeting of newMeetings) {
    await upload(MessageModel, generateManyMessages(meeting, 15));
  }
}

reset().then( () => disconnect());
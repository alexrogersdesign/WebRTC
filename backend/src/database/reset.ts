import {fileTypeFromBuffer} from 'file-type';
import {Document, Model} from 'mongoose';
import ObjectID from 'bson-objectid';

import {MeetingModel, MessageModel} from './models';
import Meeting from '../../../frontend/src/shared/classes/Meeting.js'
import Message from '../../../frontend/src/shared/classes/Message.js';
import {generateManyMeetings, generateManyMessages} from './tempateData';

interface UploadableItem<T> {
  id: ObjectID,
  icon?: string,
}

const processIcon = async (iconString?: string) => {
  if (iconString) {
    const iconBuffer = Buffer.from(iconString, "utf8")
    const bufferType = await fileTypeFromBuffer(iconBuffer)
    return {
      data: iconBuffer,
      mimeType: bufferType,
    }
  }
}
async function upload<T>(model: Model<UploadableItem<T>>, items: Array<UploadableItem<T>>) {
  const docs: Array< Document<any, any, UploadableItem<T>> & UploadableItem<T> & { _id: ObjectID }> = [];

  for await (const item of items) {
    const {id, icon: iconString,  ...rest} = item;
    const icon = await processIcon(iconString)
    const doc = new model({
      _id: item.id,
      icon,
      rest,
    })
    docs.push(doc)
  }
  try {
   await model.create(...docs)
  } catch (error) {
    console.error(error);
  }
}



async function resetMeetings() {
  //MeetingModel.deleteMany({}, {callback : (info) => console.log(info)} )
  const newMeetings = generateManyMeetings(5)
  await upload<Meeting>(MeetingModel, newMeetings)
  newMeetings.forEach((meeting) => upload<Message>(MessageModel, generateManyMessages(meeting,10)))
}

resetMeetings();
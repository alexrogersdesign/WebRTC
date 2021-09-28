import  {Schema, model} from "mongoose";

import User from "../../frontend/src/shared/classes/User";
import Meeting from "../../frontend/src/shared/classes/Meeting";
import Message from "../../frontend/src/shared/classes/Message";

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
    },
})
userSchema.loadClass(User);
export const UserModel = model('User', userSchema);

const meetingSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
    },
    attendees: {
        type: [Schema.Types.ObjectId],
        default: []
    }
})
meetingSchema.loadClass(Meeting);
export const MeetingModel = model('Meeting', meetingSchema);

const messageSchema = new Schema({
    // TODO update timestamp to proper type for mongo or omit
    timeStamp: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId
    },
    // TODO update content types
    contents: {
        type: String,
        required: true,
        minlength: 1,
    },
    type: {
        type: String
    },
    alt: {
        type: String
    },
})
messageSchema.loadClass(Message)
export const MessageModel = model('Message', messageSchema)
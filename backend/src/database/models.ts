import  {Schema, model, Document} from "mongoose";

import User from "../../../frontend/src/shared/classes/User";
import Meeting from "../../../frontend/src/shared/classes/Meeting";
import Message from "../../../frontend/src/shared/classes/Message";
import {parseMeeting, parseMessage, parseUser} from '../../../frontend/src/util/classParser'

interface IUser extends User {
    passwordHash: string
}

const userSchema = new Schema<IUser>({
    _id: {
        type: Schema.Types.ObjectId
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
    },
    passwordHash: String,
})
userSchema.loadClass(User);
userSchema.set('toObject', {
    transform: function (doc: Document, ret):User {
        delete ret.passwordHash;
        const newuser = parseUser(ret)
        return newuser.id = ret._id
      }
})
export const UserModel = model<IUser>('User', userSchema);

const meetingSchema = new Schema<Meeting>({
    _id: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true,
        minLength: 3,
    },
    attendees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
})
meetingSchema.loadClass(Meeting);
meetingSchema.set('toObject', {
    transform: function (doc: Document, ret) {
        parseMeeting(ret)
      }
})
export const MeetingModel = model<Meeting>('Meeting', meetingSchema);

const messageSchema = new Schema<Message>({
    _id: {
        type: Schema.Types.ObjectId
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    meetingId: {
        type: Schema.Types.ObjectId,
        ref: 'Meeting'
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
messageSchema.set('toObject', {
    transform: function (doc: Document, ret) {
        parseMessage(ret)
      }
})
export const MessageModel = model<Message>('Message', messageSchema)
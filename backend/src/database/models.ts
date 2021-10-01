import  mongoose from "mongoose";
const {Schema, model, Document} = mongoose;
import User from "../../../frontend/src/shared/classes/User.js";
import Meeting from "../../../frontend/src/shared/classes/Meeting.js";
import Message from "../../../frontend/src/shared/classes/Message.js";
import {parseMeeting, parseMessage, parseUser} from '../../../frontend/src/util/classParser.js'

interface IUser extends User {
    passwordHash: string,
    // _firstName: string,
    // _lastName: string,
}

const userSchema = new Schema<IUser>({
    _id: {
        type: Schema.Types.ObjectId
    },
    firstName:{
        type: String,
        // required: true,
    },
    lastName:{
        type: String,
    },
    passwordHash: String,
    email:{
        type: String,
        required: true,
    }
})

// userSchema.loadClass(User);
userSchema.set('toObject', {
    transform: function (doc: Document, ret):User {
        console.log('transform fired')
        delete ret.passwordHash;
        const newUser = parseUser(ret)
        console.log('transformed user', newUser)
        const testUser = new User('test','test','test')
        console.log('test user', testUser)
        newUser.id = ret._id
        return newUser
      }
})
// userSchema.options.toObject.transform = function (doc: Document, ret):User {
//     delete ret.passwordHash;
//     const newUser = parseUser(ret)
//     newUser.id = ret._id
//     return newUser
// }
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
// meetingSchema.loadClass(Meeting);
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
// messageSchema.loadClass(Message)
messageSchema.set('toObject', {
    transform: function (doc: Document, ret) {
        parseMessage(ret)
      }
})
export const MessageModel = model<Message>('Message', messageSchema)
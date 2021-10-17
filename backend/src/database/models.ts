import mongoose from "mongoose";
const {Schema, model} = mongoose;
import User from "../../../frontend/src/shared/classes/User.js";
import Meeting from "../../../frontend/src/shared/classes/Meeting.js";
import Message from "../../../frontend/src/shared/classes/Message.js";

interface IUser extends User {
    passwordHash: string,
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
        unique: true,
    },
    icon:{
        data: Buffer,
        mimeType: String
    },
})

userSchema.set('toObject', {
    transform: function (doc: Document, ret):User {
        ret.id = ret._id
        delete ret.passwordHash;
        delete ret._id;
        return ret
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
    description: {
        type: String,
        required: true,
        minLength: 3,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    icon: {
        data: Buffer,
        mimeType: String
    },
    attendees: [
        {
            type: Schema.Types.Mixed,
            ref: 'User'
        }
    ],
    // attendees: {
    //     type: [Schema.Types.ObjectId],
    //     default: [],
    //     ref: 'User'
    // },
    // attendees: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'User'
    //     }
    // ],
})
// meetingSchema.loadClass(Meeting);
meetingSchema.set('toObject', {
    transform: function (doc: Document, ret) {
        ret.id = ret._id
        delete ret._id;
        return ret
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
messageSchema.set('toObject', {
    transform: function (doc: Document, ret) {
        ret.id = ret._id
        delete ret._id;
        return ret
      }
})
export const MessageModel = model<Message>('Message', messageSchema)

const meetingImageSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    meeting: {
        type: Schema.Types.ObjectId,
        ref: 'Meeting'
    },
    image: {
        data:Buffer,
        contentType: String
    }
})
meetingImageSchema.set('toObject', {
    transform: function (doc: Document, ret) {
        ret.id = ret._id
        delete ret._id;
        return ret
    }
})

export const MeetingImageModel = model<Message>('MeetingImage', meetingImageSchema)

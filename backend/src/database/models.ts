import mongoose from "mongoose";
const {Schema, model} = mongoose;

import Meeting from '../shared/classes/Meeting.js';
import User from '../shared/classes/User.js';
import Message from '../shared/classes/Message.js';

// TODO: Cascade delete messages when meeting is deleted

interface IUser extends User {
    passwordHash: string,
}

/** The MongoDB schema for user documents */
const userSchema = new Schema<IUser>({
    _id: {
        type: Schema.Types.ObjectId
    },
    firstName:{
        type: String,
    },
    lastName:{
        type: String,
    },
    passwordHash: String,
    email:{
        type: String,
        lowercase: true,
        required: true,
        unique: true,
    },
    icon:{
        data: Buffer,
        mimeType: String
    },
})
/** Override the toObject method to remove sensitive information and reformat
 *  when the document is retrieved from the database */
userSchema.set('toObject', {
    transform: function (doc: Document, ret):User {
        ret.id = ret._id
        delete ret.passwordHash;
        delete ret._id;
        return ret
      }
})

/** The MongoDB model for interacting with User data in the database */
export const UserModel = model<IUser>('User', userSchema);

/** The MongoDB schema for meeting documents*/
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
})
/** Override the toObject method to reformat when the document is
 *  retrieved from the database */
meetingSchema.set('toObject', {
    transform: function (doc: Document, ret) {
        ret.id = ret._id
        delete ret._id;
        return ret
      }
})
/** The MongoDB model for interacting with Meeting data in the database */
export const MeetingModel = model<Meeting>('Meeting', meetingSchema);

/** The MongoDB schema for message documents */
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
/** Override the toObject method to reformat when the document is
 *  retrieved from the database */
messageSchema.set('toObject', {
    transform: function (doc: Document, ret) {
        ret.id = ret._id
        delete ret._id;
        return ret
      }
})
/** After the document is saved, populate the user and meeting fields */
messageSchema.post('save', function(doc, next) {
    doc.populate('user','meeting').then(function() {
        next();
    });
});
/** The MongoDB model for interacting with Meeting data in the database */
export const MessageModel = model<Message>('Message', messageSchema)

import {ApolloServer, UserInputError, gql} from 'apollo-server'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import {UserModel, MeetingModel, MessageModel} from "./models";
// TODO change key to env variable
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'
// TODO change URI to env variable
const MONGODB_URI = 'mongodb+srv://arogers:postbox@cluster0.eywar.mongodb.net/webrtc?retryWrites=true&w=majority'
console.log('Connecting to', MONGODB_URI)
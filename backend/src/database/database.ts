import mongoose from 'mongoose';
import * as dotenv from "dotenv";

dotenv.config();

// TODO change secret to env variable
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'
const MONGODB_URI = process.env.FULL_DB_CONN_STRING as string
console.log('Connecting to', MONGODB_URI)


export default function connect () {
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('connected to MongoDB')
        })
        .catch((error) => {
            console.log('error connection to MongoDB:', error.message)
        })
}

import mongoose from 'mongoose';

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
    mongoose.set('bufferTimeoutMS', 20000);
}

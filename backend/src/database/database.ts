import mongoose from 'mongoose';

const MONGODB_URI = process.env.FULL_DB_CONN_STRING as string


export default function connect (uri = MONGODB_URI) {
    console.log('Connecting to', uri)
    mongoose.connect(uri)
        .then(() => {
            console.log('connected to MongoDB')
        })
        .catch((error) => {
            console.log('error connection to MongoDB:', error.message)
        })
    mongoose.set('bufferTimeoutMS', 20000);
}

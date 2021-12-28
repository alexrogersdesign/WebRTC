import mongoose from 'mongoose';

const MONGODB_URI = process.env.FULL_DB_CONN_STRING as string


export default function connect (uri = MONGODB_URI) {
    console.log('Connecting to', uri)
    mongoose.connect(uri)
        .then(() => {
            console.log('Connected to MongoDB')
        })
        .catch((error) => {
            console.log('Error connection to MongoDB:', error.message)
        })
    mongoose.set('bufferTimeoutMS', 20000);
}

export async function disconnect () {
    console.log('Disconnecting from database ')
    return mongoose.disconnect()
}
import mongoose from 'mongoose';

const MONGODB_URI = process.env.FULL_DB_CONN_STRING as string

/**
 * Connects to the database
 * @param {string} uri The database connection URI.
 */
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

/**
 * Disconnect from the database
 * @return {Promise<void>}
 */
export async function disconnect () {
    console.log('Disconnecting from database ')
    return mongoose.disconnect()
}
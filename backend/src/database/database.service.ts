// import * as mongoDB from "mongodb";
// import * as dotenv from "dotenv";

// export const collections: { meetings?: mongoDB.Collection, users?: mongoDB.Collection, messages?: mongoDB.Collection } = {}


// export async function connectToDatabase () {
//     dotenv.config();
 
    
//     const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING as string);
            
//     await client.connect();
        
//     const db: mongoDB.Db = client.db(process.env.DB_NAME);

//     await db.command({
//         "collMod": process.env.USERS_COLLECTION_NAME,
//         "validator": {
//             $jsonSchema: {
//                 bsonType: "object",
//                 required: ["firstName", "lastName", "id"],
//                 additionalProperties: false,
//                 properties: {
//                 _id: {},
//                 firstName: {
//                     bsonType: "string",
//                     description: "'name' is required and is a string"
//                 },
//                 lastName: {
//                     bsonType: "number",
//                     description: "'price' is required and is a number"
//                 },
//                 }
//             }
//          }
//     });
   
//     const usersCollection: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME as string);
//     const meetingsCollection: mongoDB.Collection = db.collection(process.env.MEETNGS_COLLECTION_NAME as string);
//     const messagesCollection: mongoDB.Collection = db.collection(process.env.MESSAGES_COLLECTION_NAME as string);
 
//   collections.users = usersCollection;
//   collections.meetings = meetingsCollection;
//   collections.messages = messagesCollection;
       
//          console.log(`Successfully connected to database: ${db.databaseName} 
//          and collections: ${usersCollection.collectionName} , ${meetingsCollection.collectionName}, ${messagesCollection.collectionName} `);
//  }
// import express, { Request, Response } from "express";
// import { ObjectId } from "mongodb";
// import Meeting from "../../../frontend/src/shared/classes/Meeting";

// export const meetingsRouter = express.Router();


// meetingsRouter.get("/", async (_req: Request, res: Response) => {
//     try {
//        const meetings = (await collections?.meetings?.find({}).toArray()) as Meeting[];

//         res.status(200).send(meetings);
//     } catch (error) {
//         if (error instanceof Error) {
//             res.status(500).send(error.message);
//         } else {
//             res.status(500).send('Unknown Error Occured');
//         }
//     }
// });

// meetingsRouter.get("/:id", async (req: Request, res: Response) => {
//     const id = req?.params?.id;

//     try {
        
//         const query = { _id: new ObjectId(id) };
//         const meeting = (await collections?.meetings?.findOne(query)) as Meeting;

//         if (meeting) {
//             res.status(200).send(meeting);
//         }
//     } catch (error) {
//         res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
//     }
// });

// meetingsRouter.post("/", async (req: Request, res: Response) => {
//     try {
//         const newMeeting = req.body as Meeting;
//         const result = await collections?.meetings?.insertOne(newMeeting);

//         result
//             ? res.status(201).send(`Successfully created a new meeting with id ${result.insertedId}`)
//             : res.status(500).send("Failed to create a new meeting.");
//     } catch (error) {
//         console.error(error);
//         if (error instanceof Error) {
//             res.status(400).send(error.message);
//         }
//         else res.status(400).send()
//     }
// });

// meetingsRouter.put("/:id", async (req: Request, res: Response) => {
//     const id = req?.params?.id;

//     try {
//         const updatedMeeting: Meeting = req.body as Meeting;
//         const query = { _id: new ObjectId(id) };
      
//         const result = await collections?.meetings?.updateOne(query, { $set: updatedMeeting });

//         result
//             ? res.status(200).send(`Successfully updated meeting with id ${id}`)
//             : res.status(304).send(`Meeting with id: ${id} not updated`);
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error(error.message);
//             res.status(400).send(error.message);
//         }
//         console.error('Unknown Error at meeting PUT');
//         res.status(400).send();
//     }
// });

// meetingsRouter.delete("/:id", async (req: Request, res: Response) => {
//     const id = req?.params?.id;

//     try {
//         const query = { _id: new ObjectId(id) };
//         const result = await collections?.meetings?.deleteOne(query);

//         if (result && result.deletedCount) {
//             res.status(202).send(`Successfully removed meeting with id ${id}`);
//         } else if (!result) {
//             res.status(400).send(`Failed to remove meeting with id ${id}`);
//         } else if (!result.deletedCount) {
//             res.status(404).send(`Meeting with id ${id} does not exist`);
//         }
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error(error.message);
//             res.status(400).send(error.message);
//         }
//         console.error('Unknown Error at meeting DELETE');
//         res.status(400).send();
//     }
// });
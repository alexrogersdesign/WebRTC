import express, { Request, Response } from "express";
import ObjectID from 'bson-objectid';

import {MeetingModel} from "../database/models.js";
import {authErrorHandler, authRestricted} from "../util/middleware/authMiddleware.js";
import {uploadMemory} from "../util/middleware/filesMiddleware.js";

const meetingsRouter = express.Router();
meetingsRouter.use(authRestricted);
//* handle errors from token validation
meetingsRouter.use(authErrorHandler)

meetingsRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const meetings = await MeetingModel
            .find({})
        meetings.map(meeting => meeting.toObject())
        res.status(200).send(meetings);
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Unknown Error Occurred');
        }
    }
});

meetingsRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        const query = { _id: new ObjectID(id) };
        const meeting = await MeetingModel
            .findOne(query)
        if (meeting) {
            res.status(200).send(meeting);
        }
    } catch (error) {
        console.log(error)
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

/** Use uploadMemory middleware to retrieve icon image from "icon" formdata field */
meetingsRouter.post("/", uploadMemory.single('icon'), async (req: Request, res: Response) => {
    try {
        const {id,  ...rest} = req.body;
        const newMeeting = new MeetingModel ({
            _id: id,
            icon: {
                data: req?.file?.buffer,
                mimeType: req?.file?.mimetype
            },
            ...rest
        })
        const result = await newMeeting.save();
        result
            ? res.status(201).json(result)
            : res.status(500).send("Failed to create a new meeting.");
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
        else res.status(400).send()
    }
});

meetingsRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        const query = { _id: new ObjectID(id) };
        const {title} = req.body;
        const updatedMeeting = {
            title
        }
        const result = await MeetingModel.updateOne(query, { $set: updatedMeeting });
        result
            ? res.status(200).send(`Successfully updated meeting with id ${id}`)
            : res.status(304).send(`Meeting with id: ${id} not updated`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
        console.error('Unknown Error at meeting PUT');
        res.status(400).send();
    }
});

meetingsRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        const query = { _id: new ObjectID(id) };
        const result = await MeetingModel.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed meeting with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove meeting with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Meeting with id ${id} does not exist`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
        console.error('Unknown Error at meeting DELETE');
        res.status(400).send();
    }
});
export default meetingsRouter
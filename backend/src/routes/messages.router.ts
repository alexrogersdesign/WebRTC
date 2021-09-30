import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";

import Message from "../../../frontend/src/shared/classes/Message";
import {MessageModel} from "../database/models.js";
import {authRestricted} from "../util/middleware/authMiddleware.js";

const messagesRouter = express.Router();
messagesRouter.use(authRestricted);

messagesRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const messages = (await MessageModel.find({}).populate('User','Meeting'));
        messages.map(message => message.toObject() as unknown as Message)

        res.status(200).send(messages);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Unknown Error Occurred');
        }
    }
});

messagesRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {

        const query = { _id: new ObjectId(id) };
        const message = (await MessageModel.findOne(query)?.populate('User','Meeting')) as Message;

        if (message) {
            res.status(200).send(message);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

messagesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const {id, user, meeting, contents} = req.body;
        const newMessage = new MessageModel ({
            _id: id,
            user,
            meeting,
            contents
        })
        const result = await newMessage.save();
        result
            ? res.status(201).json(result)
            : res.status(500).send("Failed to create a new message.");
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
        else res.status(400).send()
    }
});

messagesRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const {title} = req.body;
        const updatedMessage = {
            title
        }
        const result = await MessageModel.updateOne(query, { $set: updatedMessage });
        result
            ? res.status(200).send(`Successfully updated message with id ${id}`)
            : res.status(304).send(`Message with id: ${id} not updated`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
        console.error('Unknown Error at message PUT');
        res.status(400).send();
    }
});

messagesRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await MessageModel.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed message with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove message with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Message with id ${id} does not exist`);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(400).send(error.message);
        }
        console.error('Unknown Error at message DELETE');
        res.status(400).send();
    }
});
export default messagesRouter
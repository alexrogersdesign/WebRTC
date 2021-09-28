import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Message from "../../../frontend/src/shared/classes/Meeting";
import { MessageModel} from "../database/models";


export const messagesRouter = express.Router();
messagesRouter.use(express.json());


messagesRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const messages = (await MessageModel.find({}));
       messages.map(message => message.toObject() as unknown as Message)

        res.status(200).send(messages);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Unknown Error Occured');
        }
    }
});

messagesRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        const query = { _id: new ObjectId(id) };
        const message = (await MessageModel.findOne(query)) as unknown as Message;

        if (message) {
            res.status(200).send(message);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

messagesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newMessage = new MessageModel ({
            ...req.body
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
        const updatedMessage = {
            ...req.body,
            ...query
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

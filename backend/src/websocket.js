/* jshint esversion: 6 */
import jwt from "jsonwebtoken";
import { MeetingModel, UserModel } from "./database/models.js";
import { parseMeeting, parseUser } from "../../frontend/src/util/classParser.js";
const secretKey = process.env.SECRET_KEY;
const findUser = async (id) => {
    const foundUser = await UserModel.findById(id);
    return parseUser(foundUser);
};
const findMeeting = async (id) => {
    const foundMeeting = await MeetingModel.findById(id);
    return parseMeeting(foundMeeting);
};
const authHandler = async (socket) => {
    //TODO test expired token refresh
    let { token = null } = socket.handshake.auth || {};
    if (token) {
        try {
            if (Array.isArray(token))
                token = token[0];
            if (!secretKey)
                throw new Error('Missing token or refresh token key');
            const decodedToken = jwt.verify(token, secretKey);
            //* expect decodedToken to be object not string
            if (typeof decodedToken === 'string')
                throw new Error('Token Decode Error');
            console.log('decoded token id', decodedToken.id);
            return findUser(decodedToken.id);
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                socket.emit('ExpiredToken');
                console.log('Expired Token', error);
            }
            console.log(error);
            socket.disconnect();
        }
    }
    socket.emit('error', 'Authentication Token Not Provided');
    socket.disconnect();
};
const websocket = (io) => {
    const updateMeetingList = async (id) => {
        // const newMeeting = new Meeting('Test Meeting Title');
        const newMeeting = await findMeeting(id);
        // TODO update database for meeting list
        return newMeeting;
    };
    const joinRoom = async (socket, roomID) => {
        try {
            const newMeeting = await updateMeetingList(roomID);
            // socket.emit('NewMeeting', newMeeting);
            console.log('Emitted meeting', newMeeting);
            socket.join(roomID);
        }
        catch (error) {
            socket.emit('Error', error);
        }
    };
    /**
    * Setup socket connection behaviors
    */
    io.on('connection', async (socket) => {
        const newUser = await authHandler(socket);
        console.log('new connection', newUser?.fullName);
        // console.log('user:', newUser)
        //* Send user id
        socket.emit('CurrentUserID', newUser?.id.toString());
        //* Get room parameter from url.
        const roomID = socket.handshake.query.room;
        //* Check if a room id parameter was supplied
        //* If so, join that meeting.
        if (roomID && roomID !== 'null' && !Array.isArray(roomID)) {
            await joinRoom(socket, roomID);
        }
        socket.on('JoinMeeting', (meetingData) => {
            const { user, roomID } = meetingData;
            console.log('rooms: ', socket.rooms);
            if (socket.rooms.has(roomID))
                return;
            io.to(roomID).emit('NewUserConnected', user);
            joinRoom(socket, roomID);
            console.log('rooms after join: ', socket.rooms);
            // TODO add user to meeting attendees
            //* inform attendees if a user disconnects
            const leaveRoom = () => {
                socket.to(roomID).emit('UserDisconnected', user);
            };
            socket.on('SendMessage', (message) => {
                socket.broadcast.to(roomID).emit('ReceivedMessage', message);
            });
            socket.on('LeaveRoom', () => {
                leaveRoom();
            });
            socket.on('disconnect', () => {
                leaveRoom();
                // TODO: clean up room attendees.
            });
        });
    });
};
export default websocket;

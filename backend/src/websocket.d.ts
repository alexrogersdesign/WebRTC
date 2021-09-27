import Meeting from '../../frontend/src/shared/classes/Meeting.js';
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
export interface IMeetingList {
    [key: string]: Meeting;
}
declare const websocket: (io: Server<DefaultEventsMap, DefaultEventsMap>) => void;
export default websocket;

import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
/**
 * The websocket setup function. Creates socket listeners that implement
 * the SocketIO functionality.
 * @param {Server} io The SocketIO server
 */
declare const websocket: (io: Server<DefaultEventsMap, DefaultEventsMap>) => void;
export default websocket;

import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
declare const websocket: (io: Server<DefaultEventsMap, DefaultEventsMap>) => void;
export default websocket;

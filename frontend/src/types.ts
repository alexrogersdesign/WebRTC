import Peer, {MediaConnection} from 'peerjs';

export interface ChildrenProps {
   children?: JSX.Element;
}

export type Meeting = {
   id: string;
 }

export interface IMeetingData {
   userID: string,
   roomID: string,
}

export interface IExternalMedia {
   user: User,
   stream: MediaStream,
   data?: any,

}

export interface IPeers {
   [key: string]: MediaConnection
 }

export type User = {
   id: string,
   firstName?: string,
   lastName?: string,
}

export interface ISocketIOContex {
   setupSocketListeners: () => void;
   currentUserID: string,
   setCurrentUserID: (userID: string) => void,
   meeting: Meeting | null,
   externalMedia: IExternalMedia[],
   peers: React.MutableRefObject<IPeers | null>,
   peerConnection: React.MutableRefObject<Peer | null>,
   localVideoRef: React.RefObject<HTMLVideoElement>,
   canvasRef: React.RefObject<HTMLCanvasElement>,
   initializeMediaStream: () => void,
   setPeerOpenedConnectionListner: () => void,
   connectToUser: (externalUser: string) => void,
   endConnection: () => void,
   setMeeting: (meeting: Meeting) => void,
   joinMeeting: (meeting: Meeting) => void,
   startNewMeeting: () => void,
   leaveMeeting: () => void,
   setMicMuted: (boolean: boolean) => void,
   setVideoDisabled: (boolean: boolean) => void,
   setScreenSharing: (boolean: boolean) => void,
   setRemoveBackground: (boolean: boolean) => void,
   micMuted: boolean,
   videoDisabled: boolean,
   screenSharing: boolean,
   removeBackground: boolean
}


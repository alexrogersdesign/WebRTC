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
   initializeConnection: () => void;
   currentUserID: string,
   setCurrentUserID: (userID: string) => void,
   meeting: Meeting | null,
   externalMedia: IExternalMedia[],
   peers: IPeers,
   peerConnection: React.MutableRefObject<Peer | null>,
   localVideoRef: React.RefObject<HTMLVideoElement>,
   initializeMediaStream: () => void,
   initializeMeeting: () => void,
   connectToUser: (externalUser: string) => void,
   endConnection: () => void,
   setMeeting: (meeting: Meeting) => void,
   joinMeeting: (meeting: Meeting) => void,
   startNewMeeting: () => void,
   leaveMeeting: () => void,
}


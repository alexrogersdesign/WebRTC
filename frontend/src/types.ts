/* eslint-disable no-unused-vars */
import Peer, {MediaConnection} from 'peerjs';

export interface ChildrenProps {
   children?: JSX.Element;
}

export type Meeting = {
   id: string;
   title: string;
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

export interface ISegmentationContext {
   segmentationReady: boolean,
   removeBackground: boolean,
   setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>,
   tempVideo: React.MutableRefObject<HTMLVideoElement>,
   canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
}

// export enum Side {
//    left = 'left',
//    right = 'right',
//   }
export type Side = 'left' | 'right'
export enum MessageType {
   image = 'image'
}

export type Message = {
   timeStamp: Date,
   user: User,
   id: string,
   contents: string,
   type?: MessageType,
   alt?: string,
   side?: Side
}

export interface ISocketIOContext {
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
   setPeerOpenedConnectionListener: () => void,
   connectToUser: (externalUser: string) => void,
   endConnection: () => void,
   setMeeting: (meeting: Meeting) => void,
   joinMeeting: (meetingID: string) => void,
   startNewMeeting: () => void,
   leaveMeeting: () => void,
   setMicMuted: (boolean: boolean) => void,
   setVideoDisabled: (boolean: boolean) => void,
   setScreenSharing: (boolean: boolean) => void,
   setRemoveBackground: (boolean: boolean) => void,
   micMuted: boolean,
   videoDisabled: boolean,
   screenSharing: boolean,
   removeBackground: boolean,
   segmentationReady: boolean,
   localMedia: MediaStream | undefined,
   outgoingMedia: React.MutableRefObject<MediaStream | undefined>,
   changePeerStream: (stream: MediaStream) => void
}


/* eslint-disable no-unused-vars */
import Peer, {MediaConnection} from 'peerjs';
import User from './classes/User';
import Meeting from './classes/Meeting';

export interface ChildrenProps {
   children?: JSX.Element;
}

// export type Meeting = {
//    id: string;
//    title: string;
//  }

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

// export type User = {
//    id: string,
//    firstName?: string,
//    lastName?: string,
// }

export interface ISegmentationContext {
   segmentationReady: boolean,
   removeBackground: boolean,
   setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>,
   tempVideo: React.MutableRefObject<HTMLVideoElement>,
   canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
}
export interface IChatContext {
   messageList: Message[],
   sendMessage: (message: Message) => void
}

export type Side = 'left' | 'right'
export type MessageType = 'image' | 'text'
export interface MessageImage {
   image: MediaImage,
   alt: string,
}
//
// export type Message = {
//    timeStamp: Date,
//    user: User,
//    id: string,
//    contents: string | MessageImage,
//    type?: MessageType,
//    alt?: string,
//    side?: Side
// }
export interface ICallMetadata {
   user: User
}

export interface ISocketIOContext {
   setupSocketListeners: () => void,
   currentUser: User,
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
   changePeerStream: (stream: MediaStream) => void,
   videoReady: boolean,
}


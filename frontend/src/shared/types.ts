/* eslint-disable no-unused-vars */
import React from 'react';
import Peer, {MediaConnection} from 'peerjs';
import User from './classes/User';
import Meeting from './classes/Meeting';
import Message from './classes/Message';

export interface ChildrenProps {
   children?: JSX.Element;
}
export interface ChildrenPropsMandatory {
   children: JSX.Element;
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

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
   [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
}[Keys]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
   [K in Keys]-?:
    Required<Pick<T, K>>
    & Partial<Record<Exclude<Keys, K>, undefined>>
}[Keys]


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
   currentUser: User| null,
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


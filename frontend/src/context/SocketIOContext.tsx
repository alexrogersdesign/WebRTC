/* eslint-disable no-unused-vars */
import React, {createContext, useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {io} from 'socket.io-client';
import env from 'react-dotenv';
import Peer, {MediaConnection} from 'peerjs';

import {
  Meeting,
  IExternalMedia,
  IPeers,
  ISocketIOContex,
  ChildrenProps,
} from '../types';


// const peerServer = env.PEER_SERVER;
// const peerServerPort = env.PEER_SERVER_PORT;

interface Props extends ChildrenProps {

}
/**
 * Context item to be passed to app
 */
const SocketIOContext = createContext<Partial<ISocketIOContex>>({});

/**
 * SocketIO server instance
 * URL of deplyed server goes here
 */
const socket = io('http://localhost:5000');


const ContextProvider: React.FC<Props> = ({children}) => {
  const [currentUserMedia, setCurrentUserMedia] =
  useState<MediaStream|null>(null);
  const [currentUserID, setCurrentUserID] = useState('');
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [externalMedia, setExternalMedia] = useState<IExternalMedia[]>([]);
  const [peers, setPeers] = useState<IPeers>({});
  const peerConnection = useRef<Peer | null>(null);
  const currentUserVideo = useRef<HTMLVideoElement>(null);


  /**
   * Initilizes all connections
   */
  const initializeConnection= () =>{
    /**
     * Initializes peer object on first load
     */
    const initPeerConnection = () => {
      peerConnection.current = new Peer('', {
        host: '/',
        port: 5001,
      });
    };
    initPeerConnection();
    initializeMeeting();
    initializeMediaStream();

    /**
     * Retrieve current user id from socket
     */
    socket.on('currentUserID', (id) => console.log(id));

    /**
     * Disconnects from peer WebRTC stream
     * Removes information from peer list and removed media stream
     */
    socket.on('UserDisconnected', (userID: string) => {
      // peers.forEach((peer) => {
      //   if (peer.id === userID) peer.disconnect;
      // });
      if (userID in peers) {
        peers[userID].close();
      }
      removePeer(userID);
      removeMedia(userID);
    });
    socket.on('error', (error) => {
      console.log('Socket Responded With Error: ', error);
    });
  };

  /**
   * Tells the server to start a new meeting and stores its information.
   */
  const setupMeeting = async () =>{
    return new Promise<void>((resolve, reject) => {
      socket.emit('NewMeeting');
      socket.on('NewMeeting', (meeting) => {
        setMeeting(meeting);
      });
    });
  };
  /**
   * Get audio and video stream from the browser
   * Will prompt user for permissions
   */
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
          {video: true, audio: true},
      );
      setCurrentUserMedia(stream);
      if (currentUserVideo.current) currentUserVideo.current.srcObject = stream;
    } catch (err) {
      console.log(err);
    }
  };
  /**
   * A helper function to enable the frontend to request webcam support
   */
  const initializeMediaStream = async () => {
    await getUserMedia();
  };

  /**
   * Starts connection with peer server and retreives user id
   * initializes meeting and tells the backend server than its joining a meeting
   */
  const initializeMeeting = async () => {
    if (!peerConnection.current) throw new Error('Peer connection missing');
    peerConnection.current.on('open', async (id:string) => {
      setCurrentUserID(id);
      await setupMeeting();
      if (!meeting) throw new Error('Unable to retrieve meeting');
      const meetingData = {
        userID: currentUserID,
        roomID: meeting.id,
      };
      socket.emit('JoinRoom', meetingData);
    });
  };
  /**
   * Helper function to remove a media stream from the
   * list of media streams to display
   * @param {string} id the id of the media to remove
   */
  const removeMedia = (id: string) => {
    setExternalMedia(externalMedia
        .filter((media:IExternalMedia) => media.id !== id));
  };
  /**
   * Helper function to add peer to peer list
   * @param {Peer} call the call information to be added to the peer list
   */
  const addPeer = (call:MediaConnection) => {
    setPeers({
      ...peers,
      call,
    });
  };
  /**
   * Helper function to remove a peer from the peer list
   * @param {string} id the id of the peer
   */
  const removePeer = (id:string) => {
    const newPeers = {...peers};
    delete newPeers[id];
    setPeers(newPeers);
  };
  /**
   * Adds media stream to list of streams to display
   * @param {MediaConnection} call  The peer information
   * @param {MediaStream} stream the media stream to add
   * @param {any} userData? any additional data
   */
  const addExternalMedia = (
      call: MediaConnection, stream:MediaStream, userData?: Peer,
  ) => {
    const newMedia = [...externalMedia];
    newMedia.push({
      id: call.metadata.id,
      stream: stream,
      data: userData? userData: undefined,
    });
    setExternalMedia(newMedia);
  };
  /**
   * Listen for a call from connecting peers
   * An incoming call is answered and the current user media (local webcam feed)
   * is sent. Cleans up connection on error or if far side closes connection
   * Adds peer to peer list
   */
  const setConnectingPeersListener = () => {
    if (!peerConnection.current) throw new Error('Missing peer connection');
    peerConnection.current.on('call', (call: MediaConnection) => {
      if (!currentUserMedia) throw new Error('User Media Missing');
      call.answer(currentUserMedia);
      call.on('stream', (stream) => {
        addExternalMedia(call, stream);
      });
      call.on('close', ()=> removeMedia(call.metadata.id));
      call.on('error', () => {
        console.log('call error: ', call.metadata.id);
        removeMedia(call.metadata.id);
      });
      addPeer(call);
    });
  };
  /**
   * Connects to (calls) an external user
   * Cleans up connection on error or if far side closes connection.
   * @param {Peer} externalUser
   */
  const connectToUser = (externalUser:Peer) => {
    const {id} = externalUser;
    const callData = {
      metadata: {
        id: currentUserID,
      },
    };
    if (!peerConnection.current) throw new Error('Missing peer connection');
    if (!currentUserMedia) throw new Error('User Media Missing');
    const call = peerConnection.current.call(id, currentUserMedia, callData);
    call.on('stream', (stream: MediaStream) => {
      addExternalMedia(call, stream, externalUser);
    });
    call.on('close', () => {
      removeMedia(call.metadata.id);
    });
    call.on('error', () => {
      console.log('call error: ', call.metadata.id);
      removeMedia(call.metadata.id);
    });
  };
  /**
   * Listens for new users connectect to meeting.
   * If a new user connects, a call is placed to the connecting user.
   */
  const newExternalUser = () => {
    socket.on('NewUserConnected', (user) => {
      connectToUser(user);
    });
  };
  /**
   * Cleans up media streams and connections
   */
  const endConnection = () => {
    setExternalMedia([]);
    socket?.disconnect();
    if (peerConnection.current) peerConnection.current.destroy();
  };

  return (
    <SocketIOContext.Provider
      value={{
        initializeConnection,
        currentUserID,
        setCurrentUserID,
        meeting,
        externalMedia,
        peers,
        peerConnection,
        currentUserVideo,
        initializeMediaStream,
        initializeMeeting,
        setConnectingPeersListener,
        connectToUser,
        newExternalUser,
        endConnection,
        setMeeting,
      }}
    >
      {children}
    </SocketIOContext.Provider>
  );
};

export {ContextProvider, SocketIOContext};

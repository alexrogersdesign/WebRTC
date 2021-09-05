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
  const [currentUserID, setCurrentUserID] = useState('');
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [externalMedia, setExternalMedia] = useState<IExternalMedia[]>([]);
  const [peers, setPeers] = useState<IPeers>({});
  const peerConnection = useRef<Peer | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  /**
   * waits for current user id to be received from socket and established
   */
  useEffect(() => {
    if (currentUserID) {
      initPeerConnection();
      initializeMeeting();
      initializeMediaStream();
    }
  }, [currentUserID]);

  /**
   * Initilizes all connections
   */
  const initializeConnection= () =>{
    /**
     * Listens for userId from socket connection.
     */
    socket.on('CurrentUserID', (id) => setCurrentUserID(id));

    console.log('current user id before peer creation', currentUserID);


    /**
     * Disconnects from peer WebRTC stream,
     * removes information from peer list and removes media stream.
     */
    socket.on('UserDisconnected', (userID: string) => {
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
     * Initializes peer object on first load
     */
  const initPeerConnection = () => {
    peerConnection.current = new Peer(currentUserID, {
      host: '/',
      port: 5001,
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
        joinMeeting(meeting);
      });
    });
  };
  /**
   * Get audio and video stream from the browser
   * Will prompt user for permissions
   */
  const initializeMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
          {video: true, audio: true},
      );
      setConnectingPeersListener(stream);
      setExternalUserListener(stream);

      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Starts connection with peer server and retreives user id
   * initializes meeting and tells the backend server than its joining a meeting
   */
  const initializeMeeting = async () => {
    if (!peerConnection.current) throw new Error('Peer connection missing');
    peerConnection.current.on('open', async (id:string) => {
      console.log('ID from peer', id);
      await setupMeeting();
    });
  };
  const joinMeeting = (newMeeting?:Meeting) => {
    if (!newMeeting && meeting) newMeeting = meeting;
    if (!newMeeting) throw new Error('Unable to retrieve meeting');
    setMeeting(newMeeting);
    const meetingData = {
      userID: currentUserID,
      roomID: newMeeting.id,
    };
    socket.emit('JoinRoom', meetingData);
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
    console.log('New peer added', call);
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
   * @param {string} id  The peers id
   * @param {MediaStream} stream the media stream to add
   * @param {any} userData? any additional data
   */
  const addExternalMedia = (
      id: string, stream:MediaStream, userData?: Peer.CallOption,
  ) => {
    // Prevent local user from being added to the list.
    if (id === currentUserID) return;
    const newMediaItem = {
      id, stream, data: userData? userData: undefined,
    };

    setExternalMedia((oldState) => {
      // Prevent duplicates from being added
      if (oldState.find((item) => item.id === id)) return oldState;
      return [...oldState, newMediaItem];
    });
  };
  /**
   * Listen for a call from connecting peers
   * An incoming call is answered and the current user media (local webcam feed)
   * is sent. Cleans up connection on error or if far side closes connection
   * Adds peer to peer list
   * @param {MediaStream} localStream local webcam stream
   */
  const setConnectingPeersListener = (localStream: MediaStream) => {
    if (!peerConnection.current) throw new Error('Missing peer connection');
    peerConnection.current.on('call', (call: MediaConnection) => {
      call.answer(localStream);
      console.log('call answered', call);

      call.on('stream', (stream) => {
        addExternalMedia(call.peer, stream);
        console.log('adding stream');
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
   * Listens for new user connectected event then calls user
   * Cleans up connection on error or if far side closes connection.
   * @param {MediaStream} localStream local webcam stream
   */
  const setExternalUserListener = (localStream:MediaStream) => {
    socket.on('NewUserConnected', (id) => {
      // Prevent local user from being added.
      if (id === currentUserID) return;
      console.log('new user connection, userid: ', id);
      const callData: Peer.CallOption = {
        metadata: {
          id,
        },
      };
      if (!peerConnection.current) throw new Error('Missing peer connection');
      const call = peerConnection.current.call(id, localStream, callData);
      console.log('Placing call', call);
      // when a stream is received, add it to external media
      call.on('stream', (stream: MediaStream) => {
        addExternalMedia(call.peer, stream, callData);
        console.log('call stream', call);
        console.log('stream received', stream);
      });
      // remove media if closed by far side
      call.on('close', () => {
        removeMedia(call.metadata.id);
        console.log('call closed');
      });
      // remove media on call error
      call.on('error', () => {
        console.log('call error: ', call.metadata.id);
        removeMedia(call.metadata.id);
      });
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
        meeting,
        externalMedia,
        peers,
        peerConnection,
        localVideoRef,
        initializeMediaStream,
        initializeMeeting,
        endConnection,
        setMeeting,
        joinMeeting,
      }}
    >
      {children}
    </SocketIOContext.Provider>
  );
};

export {ContextProvider, SocketIOContext};

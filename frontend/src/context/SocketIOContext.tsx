/* eslint-disable no-unused-vars */
import React, {createContext, useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {io} from 'socket.io-client';
import env from 'react-dotenv';
import Peer from 'peerjs';

/**
 * Context item to be passed to app
 */
const SocketIOContext = createContext();
const peerServer = env.PEER_SERVER;
/**
 * SocketIO server instance
 * URL of deplyed server goes here
 */
const socket = io('http://localhost:5000');

const ContextProvider = ({children}) => {
  // eslint-disable-next-line no-unused-vars
  const [currentUserMedia, setCurrentUserMedia] = useState(null);
  const [currentUserID, setCurrentUserID] = useState('');
  const [meeting, setMeeting] = useState({});
  const [externalMedia, setExternalMedia] = useState([]);
  const [peers, setPeers] = useState({});
  const peerConnection = useRef(null);
  const currentUserVideo = useRef(null);

  useEffect(() =>{
    /**
     * Initializes peer object on first load
     */
    const initPeerConnection = () => {
      peerConnection.current = new Peer('', {
        host: peerServer,
        secure: true,
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
    socket.on('UserDisconnected', (userID) => {
      if (peers[userID]) {
        peers[userID].disconnect();
        removePeer(userID);
        removeMedia(userID); 
      }
    })
    socket.on('error', (error) => {
      console.log('Socket Responded With Error: ', error)
    })
  }, []);

  /**
   * Tells the server to start a new meeting and stores its information. 
   */
  const setupMeeting = () =>{
    socket.emit('NewMeeting');
    socket.on('NewMeeting', (meeting) => {
      setMeeting(meeting);
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
      currentUserVideo.current.srcObject = stream;
    } catch (err) {
      console.log(err);
    }
  };
  /**
   * A helper function to enable the frontend to request webcam support 
   */
  const initializeMediaStream = async () => {
    await getUserMedia();
  }

  /**
   * Starts connection with peer server and retreives user id
   * initializes meeting and tells the backend server than its joining a meeting
   */
  const initializeMeeting = () => {
    peerConnection.on('open', (id) => {
      setCurrentUserID(id);
      setupMeeting();
      const meetingData = {
        userID: currentUserID,
        roomID: meeting.id,
      };
      socket.emit('JoinRoom', meetingData);
    });
  };
  /**
   * Helper function to remove a media stream from the list of media streams to display
   * @param id the id of the media to remove 
   */
  const removeMedia = (id) => {
    setExternalMedia(externalMedia.filter((media) => media.id !== id));
  };
  /**
   * Helper function to add peer to peer list
   * @param call the call information to be added to the peer list
   */
  const addPeer = (call) => {
    setPeers((prevState) => ({
      ...prevState,
      [call.metadata.id]: call,
    }));
  };
  /**
   * Helper function to remove a peer from the peer list 
   * @param id the id of the peer
   */
  const removePeer = (id) => {
    setPeers((prevState) => {
      prevState.filter((peer) => peer.metadata.id !== id)
    })
  }
  /**
   * Adds media stream to list of streams to display
   * @param call The peer information 
   * @param stream the media stream to add 
   * @param userData? any additional data 
   */
  const addExternalMedia = (call, stream, userData?) => {
    setExternalMedia(externalMedia.push({
      id: call.metadata.id,
      stream: stream,
      data: userData,
    }));
  };
  /**
   * Listen for a call from connecting peers
   * An incoming call is answered and the current user media (local webcam feed) is sent
   * Cleans up connection on error or if far side closes connection
   * Adds peer to peer list
   */
  const setConnectingPeersListener = () => {
    peerConnection.on('call', (call) => {
      call.answer(currentUserMedia);
      call.on('stream', (stream) => {
        addExternalMedia(call, stream);
      });
      call.on('close', ()=> removeMedia(call));
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
   * @param externalUser 
   */
  const connectToUser = (externalUser) => {
    const {id} = externalUser;
    const callData = {
      metadata: {
        id: currentUserID,
      },
    };
    const call = peerConnection.call(id, currentUserMedia, callData);
    call.on('stream', (stream) => {
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
    setExternalMedia(null);
    socket?.disconnect();
    peerConnection.current.destroy();
  };

  return (
    <SocketIOContext.Provider
    value={{
      currentUserID,
      setCurrentUserID,
      meeting,
      externalMedia,
      peers,
      peerConnection,
      currentUserVideo,
      initializeMediaStream,
      initializeMeeting,
      connectPeers: setConnectingPeersListener,
      connectToUser,
      newExternalUser,
      endConnection,
    }}
    >
      {children}
      {currentUserID}
    </SocketIOContext.Provider>
  );
};

export {ContextProvider, SocketIOContext};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

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
    const initPeerConnection = () => {
      peerConnection.current = new Peer('', {
        host: peerServer,
        secure: true,
      });
    };
    initPeerConnection();

    /**
     * Retrieve current user id from socket
         */
    socket.on('currentUserID', (id) => console.log(id));
  }, []);

  const setupMeeting = () =>{
    socket.emit('NewMeeting');
    socket.on('NewMeeting', (meeting) => {
      setMeeting(meeting);
    });
  };

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
  const initializeMediaStream = async () => {
    return await getUserMedia();
  }

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
  const removeMedia = (call) => {
    const id = call.metadata.id;
    setExternalMedia(externalMedia.filter((media) => media.id !== id));
  };
  const addPeer = (call) => {
    setPeers((prevState) => ({
      ...prevState,
      [call.metadata.id]: call,
    }));
  };
  const addExternalMedia = (call, stream, userData?) => {
    setExternalMedia(externalMedia.push({
      id: call.metadata.id,
      stream: stream,
      data: userData,
    }));
  };

  const connectPeers = () => {
    peerConnection.on('call', (call) => {
      call.answer(currentUserMedia);
      call.on('stream', (stream) => {
        addExternalMedia(call, stream);
      });
      call.on('close', ()=> removeMedia(call));
      call.on('error', () => {
        console.log('call error: ', call.metadata.id);
        removeMedia(call);
      });
      addPeer(call);
    });
  };
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
      removeMedia(call);
    });
    call.on('error', () => {
      console.log('call error: ', call.metadata.id);
      removeMedia(call);
    });
  };

  const newExternalUser = () => {
    socket.on('NewUserConnected', (user) => {
      connectToUser(user);
    });
  };
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
      connectPeers,
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

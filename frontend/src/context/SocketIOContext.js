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
  const [userMedia, setUserMedia] = useState(null);
  const [currentUserID, setCurrentUserID] = useState('');
  const [meeting, setMeeting] = useState({});

  const peerConnection = useRef(null);
  const currentUserVideo = useRef(null);

  useEffect(() =>{
    const initPeerConnection = () => {
      peerConnection = new Peer('', {
        host: peerServer,
        secure: true,
      });
    };

    // const getUserMedia = async () => {
    //   try {
    //     const stream = await navigator.mediaDevices.getUserMedia(
    //         {video: true, audio: true},
    //     );
    //     setStream(stream);
    //     currentUserVideo.current.srcObject = stream;
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // getUserMedia();
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
      setUserMedia(stream);
      currentUserVideo.current.srcObject = stream;
    } catch (err) {
      console.log(err);
    }
  };

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

  return (
    <SocketIOContext.Provider>
      {children}
      {currentUserID}
    </SocketIOContext.Provider>
  );
};

export {ContextProvider, SocketIOContext};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

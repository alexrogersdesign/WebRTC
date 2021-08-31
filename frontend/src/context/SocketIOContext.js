/* eslint-disable no-unused-vars */
import React, {createContext, useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {io} from 'socket.io-client';

/**
 * Context item to be passed to app
 */
const SocketIOContext = createContext();

/**
 * SocketIO server instance
 * URL of deplyed server goes here
 */
const socket = io('http://localhost:5000');

const ContextProvider = ({children}) => {
  // eslint-disable-next-line no-unused-vars
  const [stream, setStream] = useState(null);
  const [currentUserID, setCurrentUserID] = useState('');

  // const currentUserVideo = useRef(null);

  useEffect(() =>{
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

    /**
         * Retrieve current user id from socket
         */
    socket.on('currentUserID', (id) => setCurrentUserID(id));
  }, []);
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

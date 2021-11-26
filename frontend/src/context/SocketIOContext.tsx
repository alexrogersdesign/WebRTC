/* eslint-disable no-unused-vars */
import React, {
  createContext, MutableRefObject,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {useNavigate} from 'react-router-dom';
import {io, Socket} from 'socket.io-client';
import {useSnackbar} from 'notistack';

import {ChildrenProps} from '../shared/types';
import Meeting from '../shared/classes/Meeting';
import {
  IReceivedMeeting,
  IReceivedUser,
  parseMeeting,
  parseUser} from '../util/classParser';
import {MediaControlContext} from './MediaControlContext';
import {RestContext} from './rest/RestContext';
import {PeerConnectionContext} from './PeerConnectionContext';
import {AuthenticationError} from '../util/errors/AuthenticationError';

/** The context that handles all the Socket connection. */
const SocketIOContext = createContext<ISocketIOContext>(undefined!);

/**
 * A context provider for SocketIOContext.
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const SocketIOContextProvider: React.FC<ChildrenProps> = ({children}) => {
  // TODO remove state that can be inferred
  const {removeMedia} = useContext(MediaControlContext);
  const {
    currentUser,
    token,
    refreshToken,
    addMeetingToList,
    removeMeetingFromList,
    meeting,
  } = useContext(RestContext);
  const {
    peers,
    changePeerStream,
    removePeer,
    placeCall,
  } = useContext(PeerConnectionContext);

  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  /** Represents the socket connection */
  const socket = useRef<Socket| null>(null);
  /** The param extracted from the url indicating the current meeting */
  const roomParam = new URLSearchParams(window.location.search).get('room');

  let socketLocation = 'https://ar-webrtc.herokuapp.com/';
  if (process.env.NODE_ENV === 'development' || 'test') socketLocation = 'http://localhost:3000';
  /** SocketIO server instance */
  const connectionUrl = `${socketLocation}?room=${roomParam}`;

  const cleanupSocket= () => {
    socket.current?.removeAllListeners();
    socket.current?.disconnect();
  };
  /**
   * Creates a socket connection using the token and current user ID and
   * stores it in the socket ref object.
   */
  const buildSocketConnection = () => {
    if (token) {
      const handshake = {
        auth: {token},
        query: {'userID': currentUser?.id.toString()?? ''},
      };
      socket.current = io(connectionUrl, token? handshake : undefined);
      setupSocketListeners();
    }
  };
  /**
   * Handles an expired token event by disconnecting from the socket and
   * issuing a refresh token request via the rest API.
   * @return {Promise<void>}
   */
  const handleExpiredToken = async () => {
    try {
      socket.current?.disconnect();
      await refreshToken();
    } catch (err) {
      if (err instanceof AuthenticationError) {
        navigate('/');
        enqueueSnackbar('Please login again');
      } else {
        console.error(err);
      }
    }
  };

  /** Listens for changes in the token variable and reissues a
   * new socket connection */
  useEffect(() => {
    if (!token && socket.current) {
      handleExpiredToken();
      return;
    }
    buildSocketConnection();
    return () => {
      cleanupSocket();
    };
  }, [token]);


  /**
   * Adds socket event listeners to the socket connection.
   */
  const setupSocketListeners= () => {
    /** Clear all socket listeners previously set */
    socket.current?.removeAllListeners();
    /** Refresh token if it is expired */
    socket.current?.on('ExpiredToken', () => handleExpiredToken());
    /* Keeps the application state up to date with database*/
    socket.current?.on('MeetingDeleted', (meetingId: string)=> {
      removeMeetingFromList(meetingId);
    });
    socket.current?.on('MeetingAdded', (receivedMeeting: IReceivedMeeting)=> {
      addMeetingToList(parseMeeting(receivedMeeting));
    });

    /**
     * Listens for new user connected event then places a call to the user
     * Cleans up connection on error or if far side closes connection.
     */
    socket.current?.on('NewUserConnected', (receivedUser: IReceivedUser) => {
      console.log('io - NewUserConnected');
      const user = parseUser(receivedUser);
      /** Prevent local user from being added. */
      if (user.id === currentUser?.id) return;
      enqueueSnackbar(`${user} has joined`, {key: 'user-joined'});
      placeCall(user);
    });

    /**
     * Disconnects from peer WebRTC stream,
     * removes information from peer list and removes media stream.
     */
    socket.current?.on('UserDisconnected', (receivedUser: IReceivedUser) => {
      const user = parseUser(receivedUser);
      console.log('io - user disconnected', user.id );
      if (user.id.toString() in peers.current) {
        peers.current[user.id.toString()].close();
      }
      enqueueSnackbar(`${user.firstName} ${user.lastName} has disconnected`);
      removePeer(user.id.toString());
      removeMedia(user.id.toString());
    });
    socket.current?.on('error', (error) => {
      console.log('Socket Responded With Error: ', error);
    });
  };

  /**
   * Joins a new meeting.
   * Tells backend server that it would like to join the specified meeting
   * @param {Meeting} newMeeting the meeting to join
   */
  const socketJoinMeeting = async (newMeeting:Meeting) => {
    const meetingData = {
      userID: currentUser?.id.toString(),
      roomID: newMeeting.id.toString(),
    };
    socket.current?.emit('JoinMeeting', meetingData);
  };

  /**
   * Informs the socket connection that it is leaving the meeting.
   */
  const socketLeaveMeeting = () => {
    socket?.current?.emit('LeaveRoom');
  };

  /**
   * Cleans up media streams and connections
   */
  const endConnection = () => {
    console.log('disconnecting socket');
    socket?.current?.disconnect();
  };
  return (

    <SocketIOContext.Provider
      value={{
        socket,
        changePeerStream,
        setupSocketListeners,
        meeting,
        endConnection,
        socketJoinMeeting,
        socketLeaveMeeting,
      }}
    >
      {children}
    </SocketIOContext.Provider>
  );
};

export interface ISocketIOContext {
  socket:MutableRefObject<Socket | null>,
  setupSocketListeners: () => void,
  meeting: Meeting | null,
  endConnection: () => void,
  socketJoinMeeting: (newMeeting: Meeting) => void,
  socketLeaveMeeting: () => void,
  changePeerStream: (stream: MediaStream) => void,
}
SocketIOContext.displayName = 'SocketIO Context';


export {SocketIOContextProvider, SocketIOContext};

/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef, useState,
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
import {RestContext} from './RestContext';
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
  const {removeMedia} = useContext(MediaControlContext);
  const {
    currentUser,
    token,
    loginWithRefreshToken,
    addMeetingToList,
    removeMeetingFromList,
    meeting,
  } = useContext(RestContext);
  const {
    peers,
    removePeer,
    placeCall,
  } = useContext(PeerConnectionContext);

  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  /** Represents the socket connection */
  const [socket, setSocket] = useState<Socket|null>(null);
  /** The param extracted from the url indicating the current meeting */
  const roomParam = new URLSearchParams(window.location.search).get('room');

  let socketLocation = 'https://ar-webrtc.herokuapp.com/';
  if (process.env.NODE_ENV === 'development' || 'test') socketLocation = 'http://localhost:3000';
  /** SocketIO server instance */
  const connectionUrl = `${socketLocation}?room=${roomParam}`;

  const cleanupSocket= (newSocket?: Socket) => {
    const socketToAlter = newSocket?? socket;
    socketToAlter?.removeAllListeners();
    socketToAlter?.disconnect();
    setSocket(null);
  };
  /**
   * Creates a socket connection using the token and current user ID and
   * stores it in the socket ref object.
   * @return {Socket} The new socket connection.
   */
  const buildSocketConnection = () => {
    if (token) {
      const handshake = {
        auth: {token},
        query: {'userID': currentUser?.id.toString()?? ''},
      };
      const newSocket = io(connectionUrl, token? handshake : undefined);
      setSocket(newSocket);
      setupSocketListeners(newSocket);
      return newSocket;
    }
  };
  /**
   * Handles an expired token event by disconnecting from the socket and
   * issuing a refresh token request via the rest API.
   * @return {Promise<void>}
   */
  const handleExpiredToken = async () => {
    try {
      socket?.disconnect();
      await loginWithRefreshToken();
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
    if (!token && socket) {
      handleExpiredToken();
      return;
    }
    const newSocket = buildSocketConnection();
    return () => {
      cleanupSocket(newSocket);
    };
  }, [token]);


  /**
   * Adds socket event listeners to the socket connection.
   * @param {Socket} newSocket An optional socket connection to
   * add the even listeners to. Used when the socket event listeners
   * need to be added before waiting for the next render cycle and the
   * useState hook to finish updating.
   */
  const setupSocketListeners= (newSocket?: Socket) => {
    socket?.removeAllListeners();
    const socketToAlter = newSocket?? socket;
    /** Clear all socket listeners previously set */
    socketToAlter?.removeAllListeners();
    /** Refresh token if it is expired */
    socketToAlter?.on('ExpiredToken', () => {
      return handleExpiredToken();
    });
    /* Keeps the application state up to date with database*/
    socketToAlter?.on('MeetingDeleted', (meetingId: string)=> {
      removeMeetingFromList(meetingId);
    });
    socketToAlter?.on('MeetingAdded', (receivedMeeting: IReceivedMeeting)=> {
      addMeetingToList(parseMeeting(receivedMeeting));
    });

    /**
     * Listens for new user connected event then places a call to the user
     * Cleans up connection on error or if far side closes connection.
     */
    socketToAlter?.on('NewUserConnected', (receivedUser: IReceivedUser) => {
      console.log('io - NewUserConnected');
      const user = parseUser(receivedUser);
      /** Prevent local user from being added. */
      if (user.id === currentUser?.id) return;
      enqueueSnackbar(`${user} has joined`, {key: 'user-joined'});
      placeCall(user);
    });

    /**
     * When a user disconnects closes the peer WebRTC stream,
     * removes information from peer list and removes media stream.
     */
    socketToAlter?.on('UserDisconnected', (receivedUser: IReceivedUser) => {
      const user = parseUser(receivedUser);
      console.log('io - user disconnected', user.id );
      if (user.id.toString() in peers.current) {
        peers.current[user.id.toString()].close();
      }
      enqueueSnackbar(`${user.firstName} ${user.lastName} has disconnected`);
      removePeer(user.id.toString());
      removeMedia(user.id.toString());
    });
    socketToAlter?.on('error', (error) => {
      console.log('Socket Responded With Error: ', error);
    });
    /** Reconnect if the server ended the connection */
    socketToAlter?.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        socketToAlter?.connect();
      }
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
    socket?.emit('JoinMeeting', meetingData);
  };

  /**
   * Informs the socket connection that it is leaving the meeting.
   */
  const socketLeaveMeeting = () => {
    socket?.emit('LeaveRoom');
  };

  return (

    <SocketIOContext.Provider
      value={{
        socket,
        cleanupSocket,
        meeting,
        socketJoinMeeting,
        socketLeaveMeeting,
      }}
    >
      {children}
    </SocketIOContext.Provider>
  );
};

export interface ISocketIOContext {
  socket: Socket | null,
  cleanupSocket: (newSocket?: Socket) => void
  meeting: Meeting | null,
  socketJoinMeeting: (newMeeting: Meeting) => void,
  socketLeaveMeeting: () => void,
}
SocketIOContext.displayName = 'SocketIO Context';


export {SocketIOContextProvider, SocketIOContext};

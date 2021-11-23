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


//* Context item to be passed to app
const SocketIOContext = createContext<ISocketIOContext>(undefined!);

const SocketIOContextProvider: React.FC<ChildrenProps> = ({children}) => {
  // TODO remove state that can be inferred
  const {
    removeMedia,
    clearExternalMedia,
  } = useContext(MediaControlContext);
  const {
    currentUser,
    token,
    refreshToken,
    addMeetingToList,
    removeMeetingFromList,
    meeting,
    setMeeting,
  } = useContext(RestContext);
  const {
    peers,
    changePeerStream,
    removePeer,
    placeCall,
  } = useContext(PeerConnectionContext);


  const navigate = useNavigate();
  //* enables notification
  const {enqueueSnackbar} = useSnackbar();
  //* indicate that the video is ready to be rendered

  const socket = useRef<Socket| null>(null);
  //* the param extracted from the url indicating the current meeting
  const roomParam = new URLSearchParams(window.location.search).get('room');

  // !URL of deployed server goes here
  // const socketLocation = 'https://ar-webrtc.herokuapp.com/';
  const socketLocation = 'http://localhost:3000';
  // if (process.env.NODE_ENV !== 'production') socketLocation = 'http://localhost:3000';
  //* SocketIO server instance
  const connectionUrl = `${socketLocation}?room=${roomParam}`;


  /* Authenticate with socket backend whenever a token changes */
  useEffect(() => {
    // if (!token && socket) socket.current?.disconnect();
    if (!token && socket.current) {
      (async () => {
        try {
          socket.current?.close();
          await refreshToken();
        } catch (err) {
          if (err instanceof AuthenticationError) {
            navigate('/');
            enqueueSnackbar('Please login again');
          } else {
            console.error(err);
          }
        }
      } )();
    }
    if (token) {
      const handshake = {
        auth: {token},
        query: {'userID': currentUser?.id.toString()?? ''},
      };
      socket.current = io(connectionUrl, token? handshake : undefined);
      setupSocketListeners();
    }
    return () => {
      if (socket) {
        socket.current?.removeAllListeners();
        socket.current?.close();
      }
    };
  }, [token]);


  /**
   * Adds socket event listeners to the socket connection.
   * @return {Promise<void>} void
   */
  const setupSocketListeners= async () =>{
    /** Clear all socket listeners previously set */
    socket.current?.removeAllListeners();
    socket.current?.on('ExpiredToken', () => refreshToken());
    // TODO allow media stream to be null
    // if (!currentUser) return;
    // // //* requests webcam access from end user
    // const stream = await initializeMediaStream();
    // if (!stream) throw new Error('Video Stream not received');
    // changePeerStream(stream);

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


  const socketLeaveMeeting = () => {
    enqueueSnackbar(`Leaving meeting`);
    socket?.current?.emit('LeaveRoom');
    setMeeting(null);
    navigate('');
    clearExternalMedia();
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

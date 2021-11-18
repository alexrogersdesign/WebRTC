/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useNavigate} from 'react-router-dom';
import {io, Socket} from 'socket.io-client';
import Peer, {MediaConnection} from 'peerjs';
import {useSnackbar} from 'notistack';
import EventEmitter from 'events';
import {ChildrenProps, ICallMetadata, IPeers} from '../shared/types';
import env from 'react-dotenv';

import Meeting from '../shared/classes/Meeting';
import {
  IReceivedMeeting,
  IReceivedUser,
  parseMeeting,
  parseUser} from '../util/classParser';
import {MediaControlContext} from './MediaControlContext';
// import {DefaultEventsMap} from 'socket.io-client/build/typed-events';
import {RestContext} from './rest/RestContext';
import User from '../shared/classes/User';

const peerServer = env.PEER_SERVER;
// const peerServerPort = env.PEER_SERVER_PORT;

interface Props extends ChildrenProps {

}

const peerConnectionOptions: Peer.PeerJSOption = {
  host: '/',
  path: '/peer/connect',
  // port: 5001,
  port: 3000,
  debug: 2,
};
//* Context item to be passed to app
const SocketIOContext = createContext<ISocketIOContext>(undefined!);


const SocketIOContextProvider: React.FC<Props> = ({children}) => {
  // TODO remove state that can be inferred
  const {
    initializeMediaStream,
    outgoingMedia,
    removeMedia,
    addExternalMedia,
    clearExternalMedia,
    setShowDemo,
  } = useContext(MediaControlContext);
  const {
    currentUser,
    findMeeting,
    token,
    refreshToken,
    addMeetingToList,
    removeMeetingFromList,
  } = useContext(RestContext);

  //* The current meeting being attended
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  //* a list of peer connections;
  const peers = useRef<IPeers>({});
  const [hasJoinedMeeting, setHasJoinedMeeting] = useState<boolean>(false);
  const peerConnection = useRef<Peer | null>(null);
  const socketListeners = useRef<string[]>([]);
  const navigate = useNavigate();
  //* enables notification
  const {enqueueSnackbar} = useSnackbar();
  //* indicate that the video is ready to be rendered

  const [socket, setSocket] = useState<Socket>(null!);

  //* the param extracted from the url indicating the current meeting
  const roomParam = new URLSearchParams(window.location.search).get('room');

  // !URL of deployed server goes here
  //* SocketIO server instance
  const connectionUrl = `http://localhost:3000?room=${roomParam}`;

  // /* If a URL param for a room to join is provided, check if it is valid
  // * and join the room*/
  useEffect(() => {
    const findMeetingFromUrl = async () => {
      if (!token || !roomParam || meeting || !socket) return;
      const foundMeeting = await findMeeting(roomParam);
      if (foundMeeting) {
        joinMeeting(foundMeeting.id.toString());
      }
    };
    void findMeetingFromUrl();
    return () => {
    };
  }, [, socket]);

  /* Authenticate with socket backend whenever a token changes */
  useEffect(() => {
    if (!token && socket) socket.disconnect();
    if (!token) return;
    const handshake = {
      auth: {token},
      query: {'userID': currentUser?.id.toString()?? ''},
    };
    const newConnection = io(connectionUrl, token? handshake : undefined);
    setSocket(newConnection);
    return () => {
      newConnection.close();
    };
  }, [setSocket, token]);


  /**
   * Waits for a meeting to exist before initiating functions that
   * require meeting data.
   */
  useEffect(() => {
    const initiateStartup = async () => {
      setConnectingPeersListener();
      await setupSocketListeners();
    };
    if (
      meeting?.id &&
        currentUser &&
        outgoingMedia?.current &&
        hasJoinedMeeting
    ) {
      void initiateStartup();
    }
    return () => {
      // endConnection();
    };
  }, [meeting, hasJoinedMeeting]);

  // useEffect(() => {
  //   if (!meeting) setShowDemo(false);
  //   setShowDemo(true);
  // }, [meeting]);


  /**
   * Listens for currentUser to be set before
   * initializing Socket listeners
   */
  useEffect(() => {
    if (!meeting || !currentUser) return;
    void setupSocketListeners();
    return () => {
      socketListeners.current.forEach((event) => socket.off(event));
    };
  }, [currentUser]);

  /**
   * Sets socket connection listeners
   */
  const setupSocketListeners= async () =>{
    //* Listens for meeting from socket
    socketListeners.current = [
      'ExpiredToken',
      'NewMeeting',
      'UserDisconnected',
      'NewUserConnected'];
    if (socketListeners.current.some((event) => socket.hasListeners(event))) {
      return;
    }
    // TODO allow media stream to be null
    socket.on('ExpiredToken', () => refreshToken());
    socket.on('NewMeeting', async (receivedMeeting:IReceivedMeeting) => {
      try {
        const newMeeting = parseMeeting(receivedMeeting);
        if (!newMeeting) throw new Error('Invalid meeting received');
        enqueueSnackbar(
            `Joining meeting ${newMeeting.title}`,
            {variant: 'info'},
        );
        setMeeting(newMeeting);
      } catch (error) {
        console.log(error);
      }
    });
    if (!currentUser) return;
    //* requests webcam access from end user
    // if (!initializeMediaStream) {
    //   throw new Error('initializeMediaStream function missing');
    // }
    const stream = await initializeMediaStream();
    if (!stream) throw new Error('Video Stream not received');
    changePeerStream(stream);

    /* Keeps the application state up to date with database*/
    socket.on('MeetingDeleted', (meetingId: string)=> {
      removeMeetingFromList(meetingId);
    });
    socket.on('MeetingAdded', (receivedMeeting: IReceivedMeeting)=> {
      addMeetingToList(parseMeeting(receivedMeeting));
    });

    /**
     * Listens for new user connected event then calls user
     * Cleans up connection on error or if far side closes connection.
     */
    socket.on('NewUserConnected', (receivedUser: IReceivedUser) => {
      console.log('io - NewUserConnected');
      //* parse received json object into User
      const user = parseUser(receivedUser);
      if (!currentUser) throw new Error('current user does not exist');
      //* Prevent local user from being added.
      if (user.id === currentUser.id) return;
      enqueueSnackbar(`${user} has joined`, {key: 'user-joined'});
      const metadata : ICallMetadata = {
        user: currentUser,
      };
      const callOption: Peer.CallOption = {
        metadata,
      };
      if (!peerConnection.current) throw new Error('Missing peer connection');
      if (!outgoingMedia.current) throw new Error('Missing webcam stream');
      const call = peerConnection
          .current
          .call(user.id.toString(), outgoingMedia.current, callOption);
      console.log('Placing call', call);
      // when a stream is received, add it to external media
      call.on('stream', (stream: MediaStream) => {
        // TODO retrieve metadata from callee.
        // TODO Check if user ID needs to be updated from
        // TODO the one provided by websocket to call.peer
        console.log('peer- stream received', stream);
        addPeer(call);
        addExternalMedia(user, stream, callOption);
      });
      //* remove media if closed by far side
      call.on('close', () => {
        removeMedia(call.peer);
        console.log('call closed', call.metadata.id);
      });
      //* remove media on call error
      call.on('error', () => {
        console.log('call error: ', call.metadata.id);
        removeMedia(call.peer);
      });
    });

    /**
     * Disconnects from peer WebRTC stream,
     * removes information from peer list and removes media stream.
     */
    socket.on('UserDisconnected', (receivedUser: IReceivedUser) => {
      const user = parseUser(receivedUser);
      console.log('io - user disconnected', user.id );
      if (user.id.toString() in peers.current) {
        peers.current[user.id.toString()].close();
      }
      enqueueSnackbar(`${user.firstName} ${user.lastName} has disconnected`);
      removePeer(user.id.toString());
      removeMedia(user.id.toString());
    });
    socket.on('error', (error) => {
      console.log('Socket Responded With Error: ', error);
    });
  };

  /**
   * Initializes connection to peer server
   */
  const initPeerServerConnection = () => {
    if (!currentUser) return;
    const oldPeer = peerConnection.current;
    if (!oldPeer || oldPeer.destroyed) {
      try {
        peerConnection.current = new Peer(
            currentUser.id.toString(),
            // peerConnectionOptions,
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      oldPeer.destroy();
      initPeerServerConnection();
    }
  };

  /**
   * Requests a new meeting id from server
   * @example calling getNewMeeting() from anywhere in the application
   * Will have the backend server issue a new meeting.
   */
  const getNewMeeting = async () =>{
    socket.emit('NewMeeting');
  };

  /**
   * Changes the media stream being sent to peers.
   * @param {MediaStream} stream the stream to change to
   */
  const changePeerStream = (stream:MediaStream) => {
    Object.values(peers.current).forEach((peer) => {
      peer?.peerConnection?.getSenders()
          .find((sender)=> sender?.track?.kind === 'video')
          ?.replaceTrack(stream.getVideoTracks()[0]);
    },
    );
  };

  /**
   * Starts connection with peer server and retrieves user id
   * initializes meeting and tells the backend server than its joining a meeting
   */
  const setPeerOpenedConnectionListener = async () => {
    if (!peerConnection.current) throw new Error('Peer connection missing');
    peerConnection.current.on('open', async (id:string) => {
      console.log('ID from peer', id);
    });
  };
  /**
   * Joins a new meeting.
   * Tells backend server that it would like to join the specified meeting
   * Pushes to reflect meeting after joining meeting and sets
   * hasJoinedMeeting to true.
   * @param {string} newMeetingID the meeting to join
   */
  const joinMeeting = async (newMeetingID?:string) => {
    // TODO remove in production
    console.log('join meeting called');
    await initPeerServerConnection();
    //* If a meeting ID is not provided and the user has a meeting stored,
    //* join that meeting.
    if (!newMeetingID && meeting && meeting.id) {
      newMeetingID = meeting.id.toString();
    }
    if (!newMeetingID) throw new Error('Unable to retrieve meeting ID');
    const foundMeeting = await findMeeting(newMeetingID);
    if (!foundMeeting) throw new Error('Unable to find meeting');
    setMeeting(foundMeeting);
    const meetingData = {
      userID: currentUser?.id.toString(),
      roomID: foundMeeting.id.toString(),
    };
    socket.emit('JoinMeeting', meetingData);
    //* Push meeting to url parameter.
    navigate('?room='+ foundMeeting?.id);
    enqueueSnackbar(
        `Joining meeting ${foundMeeting.title}`,
        {variant: 'info'},
    );
    setHasJoinedMeeting(true);
  };


  /**
   * Helper function to add peer to peer list
   * @param {Peer} call the call information to be added to the peer list
   */
  const addPeer = (call:MediaConnection) => {
    console.log('New peer added', call);
    peers.current[call.peer] = call;
  };
  /**
   * Helper function to remove a peer from the peer list
   * @param {string} id the id of the peer
   */
  const removePeer = (id:string) => {
    // TODO figure if this needs to be implemented
    console.log('removing peers', id);
    delete peers.current[id];
  };

  /**
   * Listen for a call from connecting peers
   * An incoming call is answered and the current user media (local webcam feed)
   * is sent. Cleans up connection on error or if far side closes connection
   * Adds peer to peer list
   */
  const setConnectingPeersListener = () => {
    /* Casting due to incorrect typescript definitions provided by module
    * Peer extends EventEmitter */
    (peerConnection.current as unknown as EventEmitter).removeAllListeners();
    if (!peerConnection.current) throw new Error('Missing peer connection');
    peerConnection.current.on('call', (call: MediaConnection) => {
      call.answer(outgoingMedia?.current);
      console.log('call received and answered', call);
      addPeer(call);
      call.on('stream', (stream) => {
        console.log('peer - call - stream received after call received');
        const newUser = parseUser(call.metadata.user);
        addExternalMedia(newUser, stream);
      });
      call.on('close', ()=>{
        console.log('peer - call - connection closed by call');
        removeMedia(call.peer);
      });
      call.on('error', () => {
        console.log('call error: ', call.metadata.id);
        removeMedia(call.peer);
      });
    });
  };

  const startNewMeeting = () => {
    getNewMeeting();
    setupSocketListeners();
  };
  const leaveMeeting = () => {
    enqueueSnackbar(`Leaving meeting`);
    socket?.emit('LeaveRoom');
    setMeeting(null);
    setHasJoinedMeeting(false);
    navigate('');
    clearExternalMedia();
    Object.values(peers.current).forEach((peer) => peer.close());
    if (peerConnection.current) {
      peerConnection.current.destroy();
    }
  };

  /**
   * Cleans up media streams and connections
   */
  const endConnection = () => {
    console.log('disconnecting socket');
    socket?.disconnect();
    leaveMeeting();
  };
  return (

    <SocketIOContext.Provider
      value={{
        socket,
        changePeerStream,
        setupSocketListeners,
        meeting,
        peers,
        peerConnection,
        setPeerOpenedConnectionListener,
        endConnection,
        joinMeeting,
        startNewMeeting,
        leaveMeeting,
      }}
    >
      {children}
    </SocketIOContext.Provider>
  );
};

export interface ISocketIOContext {
  socket: Socket| null,
  setupSocketListeners: () => void,
  meeting: Meeting | null,
  peers: React.MutableRefObject<IPeers | null>,
  peerConnection: React.MutableRefObject<Peer | null>,
  setPeerOpenedConnectionListener: () => void,
  endConnection: () => void,
  joinMeeting: (meetingID: string) => void,
  startNewMeeting: () => void,
  leaveMeeting: () => void,
  changePeerStream: (stream: MediaStream) => void,
}
SocketIOContext.displayName = 'SocketIO Context';


export {SocketIOContextProvider, SocketIOContext};

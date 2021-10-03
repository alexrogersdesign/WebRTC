/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {createContext, useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {io} from 'socket.io-client';
import Peer, {MediaConnection} from 'peerjs';
import validator from 'validator';
import {useSnackbar} from 'notistack';

import {ChildrenProps, ICallMetadata, IExternalMedia, IPeers, ISocketIOContext} from '../shared/types';

import {ChatContextProvider} from './ChatContext';


import User from '../shared/classes/User';
import {SegmentationContextProvider} from './SegmentationContext';
import Meeting from '../shared/classes/Meeting';
import {IReceivedMeeting, IReceivedUser, parseMeeting, parseUser} from '../util/classParser';
import {RestContextProvider} from './rest/RestContext';

// const peerServer = env.PEER_SERVER;
// const peerServerPort = env.PEER_SERVER_PORT;

interface Props extends ChildrenProps {

}

//* Context item to be passed to app
const SocketIOContext = createContext<Partial<ISocketIOContext>>({});
//* the param extracted from the url indicating the current meeting
let roomParam = new URLSearchParams(window.location.search).get('room');
console.log('room param', roomParam);
if (roomParam && !validator.isUUID(roomParam)) roomParam = null;

// !URL of deployed server goes here
//* SocketIO server instance
const connectionUrl = `http://localhost:5000?room=${roomParam}`;
console.log('socket url', connectionUrl);
const socket = io(connectionUrl);


const ContextProvider: React.FC<Props> = ({children}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  //* The current meeting being attended
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  //* Whether or not the current user has disabled their microphone
  const [micMuted, setMicMuted] = useState<boolean>(false);
  //* Whether or not the current user has disabled their webcam
  const [videoDisabled, setVideoDisabled] = useState<boolean>(false);
  //* Whether or not screen sharing has been enabled
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  //* An array of MediaStreams from all current connections
  const [externalMedia, setExternalMedia] = useState<IExternalMedia[]>([]);

  const [localMedia, setLocalMedia] = useState<MediaStream>();
  //* a list of peer connections;
  const peers = useRef<IPeers>({});
  const [hasJoinedMeeting, setHasJoinedMeeting] = useState<boolean>(false);
  const peerConnection = useRef<Peer | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const history = useHistory();
  //* enables notification
  const {enqueueSnackbar} = useSnackbar();
  //* indicate that the video is ready to be rendered
  const [videoReady, setVideoReady] = useState<boolean>(false);


  //* The stream being media stream being transmitted to peers;
  const outgoingMedia = useRef<MediaStream>();


  /**
   * Waits for a meeting to exist before initiating functions that
   * require meeting data.
   */
  useEffect(() => {
    if (meeting && meeting.id && !hasJoinedMeeting && outgoingMedia.current) {
      setConnectingPeersListener();
      setExternalUserListener();
      joinMeeting(meeting.id.toString());
    }
  }, [meeting, outgoingMedia.current]);

  /**
   * Listen for changes in media controls
   */
  useEffect(() => {
    if (outgoingMedia.current) {
      outgoingMedia.current.getAudioTracks()[0].enabled = !micMuted;
      outgoingMedia.current.getVideoTracks()[0].enabled = !videoDisabled;
    }
  }, [micMuted, videoDisabled]);
  /**
   * Listen for changes in screen sharing
   * If a change is detected, initialize media stream
   * is called to handle the change.
   */
  useEffect(() => {
    initializeMediaStream(); ``;
  }, [screenSharing]);

  /**
   * Listens for currentUser to be set before initializing WebRTC and Socket connections
   */
  useEffect(() => {
    if (!currentUser) return;
    initPeerServerConnection();
    setupSocketListeners();
    return () => {
      endConnection();
    };
  }, [currentUser]);

  /**
   * Sets socket connection listeners
   */
  const setupSocketListeners= async () =>{
    //* Listens for meeting from socket
    socket.on('NewMeeting', (receivedMeeting:IReceivedMeeting) => {
      const newMeeting = parseMeeting(receivedMeeting);
      if (!newMeeting) return;
      newMeeting && enqueueSnackbar(`Joining meeting ${newMeeting.title}`, {variant: 'info'});
      setMeeting(newMeeting);
    });
    if (!currentUser) return;
    console.log('current user id before peer creation', currentUser.id);
    //* requests webcam access from end user
    await initializeMediaStream();

    /**
     * Disconnects from peer WebRTC stream,
     * removes information from peer list and removes media stream.
     */
    socket.on('UserDisconnected', (receivedUser: IReceivedUser) => {
      const user = parseUser(receivedUser);
      console.log('user disconnected', user.id );
      if (user.id.toString() in peers.current) {
        peers.current[user.id.toString()].close();
      }
      enqueueSnackbar(`${user.firstName} ${user.lastName} has disconnected`);
      // removePeer(user.id);
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
    peerConnection.current = new Peer(currentUser.id.toString(), {
      host: '/',
      port: 5001,
      debug: 2,
    });
  };

  /**
   * Requests a new meeting id from server
   * @example calling getNewMeeting() from anywhere in the application
   * Will have the backend server issue a new meeting.
   */
  const getNewMeeting = async () =>{
    socket.emit('NewMeeting');
  };

  const screenStream = useRef<MediaStream>();

  useEffect(() => {
    if (!screenStream.current) setScreenSharing(false);
  }, [screenStream.current]);

  /**
   * Get audio and video stream from the browser
   * Will prompt user for permissions
   */
  const initializeMediaStream = async () => {
    try {
      //* retrieves webcam or screen share stream based on screenSharing variable
      let stream;
      if (screenSharing && screenStream) {
        screenStream.current = stream = await navigator.mediaDevices.getDisplayMedia();
        stream.getVideoTracks()[0].addEventListener('ended', () => setScreenSharing(false));
      } else {
        stream = await navigator.mediaDevices.getUserMedia( {
          video: true,
          audio: true,
        });
        screenStream.current = undefined;
      }

      setLocalMedia(stream);
      outgoingMedia.current = stream;
      //* stores stream in ref to be used by video element
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      //* replace streams to peers if they exist
      changePeerStream(stream);
      setVideoReady(true);
    } catch (err) {
      console.log(err);
      if (err instanceof DOMException) setScreenSharing(false);
    }
  };

  /**
   * Changes the media stream being sent to peers.
   * @param {MediaStream} stream the stream to change to
   */
  const changePeerStream = (stream:MediaStream) => {
    Object.values(peers.current).forEach((peer) => {
      peer.peerConnection.getSenders()
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
      // * check if room param is invalid and retrieve new id.
      // if (!roomParam) await getNewMeeting();
    });
  };
  /**
   * Joins a new meeting.
   * Tells backend server that it would like to join the specified meeting
   * Pushes to reflect meeting after joining meeting and sets
   * hasJoinedMeeting to true.
   * @param {string} newMeetingID the meeting to join
   */
  const joinMeeting = (newMeetingID?:string) => {
    //* If a meeting ID is not provided and the user has a meeting stored,
    //* join that meeting.
    if (!newMeetingID && meeting && meeting.id) newMeetingID = meeting.id.toString();
    if (!newMeetingID) throw new Error('Unable to retrieve meeting');
    const meetingData = {
      user: currentUser,
      roomID: newMeetingID,
    };
    socket.emit('JoinMeeting', meetingData);
    //* Push meeting to url parameter.
    history.push('?room='+meeting?.id);
    setHasJoinedMeeting(true);
  };

  /**
   * Helper function to remove a media stream from the
   * list of media streams to display
   * @param {string} id the id of the media to remove
   */
  const removeMedia = (id: string) => {
    setExternalMedia((oldState)=> oldState.filter((media:IExternalMedia) => media.user.id.toString() !== id));
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
   * Adds media stream to list of streams to display
   * @param {User} user  The peer user information
   * @param {MediaStream} stream the media stream to add
   * @param {any} data? any additional data
   */
  const addExternalMedia = (
      user: User, stream:MediaStream, data?: Peer.CallOption,
  ) => {
    if (!currentUser) return;
    // Prevent local user from being added to the list.
    if (user.id === currentUser.id) return;
    const newMediaItem = {
      user, stream, data: data? data: undefined,
    };

    setExternalMedia((oldState) => {
      // Prevent duplicates from being added
      if (oldState.find((media) => media.user.id === user.id)) return oldState;
      return [...oldState, newMediaItem];
    });
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
      call.answer(outgoingMedia.current);
      console.log('call answered', call);

      addPeer(call);
      call.on('stream', (stream) => {
        const newUser = parseUser(call.metadata.user);
        // const newUser = call.metadata.user;
        addExternalMedia(newUser, stream);
      });
      call.on('close', ()=>{
        removeMedia(call.peer);
      });
      call.on('error', () => {
        console.log('call error: ', call.metadata.id);
        removeMedia(call.peer);
      });
    });
  };

  /**
   * Listens for new user connected event then calls user
   * Cleans up connection on error or if far side closes connection.
   */
  const setExternalUserListener = () => {
    socket.on('NewUserConnected', (receivedUser: IReceivedUser) => {
      // parse received json object into User
      const user = parseUser(receivedUser);
      enqueueSnackbar(`${user} has connected`);
      if (!currentUser) return;
      //* Prevent local user from being added.
      if (user.id === currentUser.id) return;
      const metadata : ICallMetadata = {
        user: currentUser,
      };
      const callOption: Peer.CallOption = {
        metadata,
      };
      if (!peerConnection.current) throw new Error('Missing peer connection');
      if (!outgoingMedia.current) throw new Error('Missing webcam stream');
      const call = peerConnection.current.call(user.id.toString(), outgoingMedia.current, callOption);
      console.log('Placing call', call);
      // when a stream is received, add it to external media
      call.on('stream', (stream: MediaStream) => {
        // TODO retrieve metadata from callee.
        // TODO Check if user ID needs to be updated from the one provided by websocket to call.peer
        // const newUser:User = {
        //   ...user,
        //   id: call.peer,
        // };
        addExternalMedia(user, stream, callOption);
        console.log('stream received', stream);
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
    history.push('');
    setExternalMedia([]);
    Object.values(peers.current).forEach((peer) => peer.close());
  };

  /**
   * Cleans up media streams and connections
   */
  const endConnection = () => {
    socket?.disconnect();
    leaveMeeting();
    if (peerConnection.current) peerConnection.current.destroy();
  };
  return (

    <SocketIOContext.Provider
      value={{
        setupSocketListeners,
        currentUser,
        meeting,
        externalMedia,
        peers,
        peerConnection,
        localVideoRef,
        initializeMediaStream,
        setPeerOpenedConnectionListener,
        endConnection,
        joinMeeting,
        startNewMeeting,
        leaveMeeting,
        setMicMuted,
        setVideoDisabled,
        setScreenSharing,
        micMuted,
        videoDisabled,
        screenSharing,
        videoReady,
      }}
    >
      <SegmentationContextProvider
        localMedia={localMedia}
        outgoingMedia={outgoingMedia}
        changePeerStream={changePeerStream}
        videoDisabled={videoDisabled}
      >
        <ChatContextProvider socket={socket}>
          <RestContextProvider setCurrentUser={setCurrentUser}>
            {children}
          </RestContextProvider>
        </ChatContextProvider>
      </SegmentationContextProvider>
    </SocketIOContext.Provider>
  );
};

export {ContextProvider, SocketIOContext};

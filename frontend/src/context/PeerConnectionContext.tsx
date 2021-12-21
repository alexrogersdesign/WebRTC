/* eslint-disable no-unused-vars */
import React, {createContext, useContext, useEffect, useRef} from 'react';

import {ChildrenProps, ICallMetadata, IPeers} from '../shared/types';
import {RestContext} from './RestContext';
import Peer, {MediaConnection} from 'peerjs';
import EventEmitter from 'events';
import {parseUser} from '../shared/util/classParser';
import {MediaControlContext} from './MediaControlContext';
import User from '../shared/classes/User';

/** The Context that handles all of the Peer to Peer communication. */
const PeerConnectionContext = createContext<IPeerConnectionContext>(undefined!);

/**
 * A context provider for PeerConnectionContext.
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const PeerConnectionContextProvider : React.FC<ChildrenProps> = ({
  children,
}) => {
  const {currentUser} = useContext(RestContext);
  const {
    outgoingMedia,
    removeMedia,
    addExternalMedia,
  } = useContext(MediaControlContext);

  /** A ref object that represents the connection to the
   * peer signalling server */
  const peerConnection = useRef<Peer | null>(null);
  /** An object representing the external peer connection. Peers are
   * stored as key-value pairs where the key is the peers ID and the value
   * is the the MediaConnection instance. */
  const peers = useRef<IPeers>({});

  /**
   * Changes the media stream being sent to peers.
   * @param {MediaStream} stream the stream to change to
   */
  const changePeerStream = (stream:MediaStream) => {
    Object.values(peers.current).forEach((peer) => {
      peer?.peerConnection?.getSenders()
          .find((sender)=> sender?.track?.kind === 'video')
          ?.replaceTrack(stream.getVideoTracks()[0]);
    });
  };
  /** Update peer stream when outgoing media changes. This
   * ensures that external streams are synchronized when the user enables
   * screen sharing or other events that change the outgoing media*/
  useEffect(() => {
    if (outgoingMedia) changePeerStream(outgoingMedia);
  }, [outgoingMedia]);


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
   * Initializes connection to peer signaling server
   * Cleans up old peer connection if one existed and
   * initializes the a new peer connection.
   */
  const initPeerServerConnection = () => {
    const oldPeer = peerConnection.current;
    if (!oldPeer || oldPeer.destroyed) {
      try {
        peerConnection.current = new Peer(
            currentUser?.id.toString(),
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
   * Handles a stream event from a Peer.MediaConnection instance.
   * Adds the received stream to the external media list.
   * Parses the user from the stream metadata.
   * @param {Peer.MediaConnection} call the MediaConnection instance
   * @param {MediaStream} stream The received stream
   * @param {User} user An optional user instance to associate with the stream
   * instead of parsing the user from the call metadata. This is useful for
   * situations where there is no call metadata i.e when placing a call to
   * an already known user.
   */
  const handleStream = (
      call:Peer.MediaConnection,
      stream:MediaStream,
      user?:User) => {
    console.log('peer - stream received');
    const newUser = user??parseUser(call.metadata.user);
    addExternalMedia(newUser, stream);
  };
  /**
   * Handles a close event from a Peer.MediaConnection instance.
   * Removes the call's stream from the external media list.
   * @param {Peer.MediaConnection} call The MediaConnection instance
   */
  const handleClose = (call:Peer.MediaConnection) => {
    console.log('peer - call - connection closed by call');
    removeMedia(call.peer);
    removePeer(call.peer);
  };
  /**
   * Handles an error event from a Peer.MediaConnection instance.
   * Removes the call's stream from the external media list.
   * @param {Peer.MediaConnection} call The MediaConnection instance
   */
  const handleError = (call:Peer.MediaConnection) => {
    console.log('call error: ', call.metadata.id);
    removeMedia(call.peer);
    removePeer(call.peer);
  };
  /**
   * Adds event listeners and associated logic for a peer call.
   * @param {Peer.MediaConnection} call The Call object to add event listeners
   * to.
   * @param {User} user An optional User instance to associate with the call
   * This is useful when the call does not contain a user metadata i.e
   * when placing a call to an eternal user.
   */
  const handleCall = (call: Peer.MediaConnection, user?:User) => {
    /** Listens for a stream event from the far size of the call. This
     * indicates that a stream has been received from the caller */
    addPeer(call);
    call.on('stream', (stream) => {
      handleStream(call, stream, user);
    });
    /** Listens for a close event from the far size of the call.
     * This indicates that the caller has closed the connection */
    call.on('close', ()=>{
      handleClose(call);
    });
    /** Listens for a error event from the far size of the call.
     * This indicates that an error has occurred in the connection */
    call.on('error', () => {
      handleError(call);
    });
  };

  /** Sets up event listeners on the peer server connection. */
  const setConnectingPeersListener = () => {
    if (!peerConnection.current) throw new Error('Missing peer connection');
    /** Listens for a call event from the peer server. Answers the call and
     * returns a media stream to the caller*/
    peerConnection.current.on('call', (call: MediaConnection) => {
      if (!outgoingMedia) throw new Error('Missing webcam stream');
      call.answer(outgoingMedia);
      console.log('call received and answered', call);
      handleCall(call);
    });
  };
  /** Cadence to get call service ready to make calls */
  const buildCallService = () => {
    initPeerServerConnection();
    setConnectingPeersListener();
  };
  /** Cadence to clean up call service */
  const dismantleCallService = () => {
    Object.values(peers.current).forEach((peer) => peer.close());
    if (!peerConnection.current) return;
    peerConnection.current?.destroy();
    /** Casting due to incorrect typescript definitions provided by module
     * Peer extends EventEmitter */
    (peerConnection.current as unknown as EventEmitter)
        ?.removeAllListeners();
  };

  /**
   * Calls another peer and adds their media connection to the external media
   * list.
   * @param {User} externalUser The destination user to call.
   */
  const placeCall = (externalUser:User) => {
    if (!currentUser) {
      throw new Error('Attempted to place call when not logged in');
    }
    const callOption: PeerCallMetadata = {
      metadata: {user: currentUser},
    };
    if (!peerConnection.current) throw new Error('Missing peer connection');
    if (!outgoingMedia) throw new Error('Missing webcam stream');
    /** Place a call to the external user */
    const call = peerConnection
        .current
        .call(externalUser.id.toString(), outgoingMedia, callOption);
    console.log('peer - Placing call', call);
    handleCall(call, externalUser);
  };


  return (
    <PeerConnectionContext.Provider value={{
      peers,
      setConnectingPeersListener,
      addPeer,
      removePeer,
      peerConnection,
      initPeerServerConnection,
      placeCall,
      buildCallService,
      dismantleCallService,
    }} >
      {children}
    </PeerConnectionContext.Provider>
  );
};

export interface IPeerConnectionContext {
  peers: React.MutableRefObject<IPeers>;
  setConnectingPeersListener: ()=>void;
  addPeer: (peer: MediaConnection)=> void;
  removePeer: (id: string)=> void;
  peerConnection: React.MutableRefObject<Peer | null>;
  initPeerServerConnection: ()=> void;
  placeCall: (externalUser: User)=> void;
  buildCallService: () => void;
  dismantleCallService: () => void;

}


PeerConnectionContext.displayName = 'Peer Connection Context';

export {PeerConnectionContextProvider, PeerConnectionContext};

export interface PeerCallMetadata extends Peer.CallOption {
  metadata: ICallMetadata
}

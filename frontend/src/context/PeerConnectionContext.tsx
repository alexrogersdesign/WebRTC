/* eslint-disable no-unused-vars */
import React, {createContext, useContext, useEffect, useRef} from 'react';
import {useSnackbar} from 'notistack';

import {ChildrenProps, ICallMetadata, IPeers} from '../shared/types';
import {RestContext} from './rest/RestContext';
import Peer, {MediaConnection} from 'peerjs';
import EventEmitter from 'events';
import {parseUser} from '../util/classParser';
import {MediaControlContext} from './MediaControlContext';
import User from '../shared/classes/User';

// const peerServer = process.env.PEER_SERVER_PATH;
// const peerServerPort = process.env.PEER_SERVER_PORT;
// const peerServerHost = process.env.PEER_SERVER_HOST;
// const peerConnectionOptions: Peer.PeerJSOption = {
//   host: peerServerHost?? '/',
//   path: '/peer/connect',
//   // port: 5001,
//   port: 3000,
//   debug: 2,
// };


const PeerConnectionContext = createContext<IPeerConnectionContext>(undefined!);

interface Props extends ChildrenProps {}

const PeerConnectionContextProvider : React.FC<Props> = ({children}) => {
  const {currentUser} = useContext(RestContext);
  const {
    outgoingMedia,
    removeMedia,
    addExternalMedia,
  } = useContext(MediaControlContext);

  const peerConnection = useRef<Peer | null>(null);
  //* a list of peer connections;
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
  /** Update peer stream when outgoing media changes */
  useEffect(() => {
    if (outgoingMedia.current) changePeerStream(outgoingMedia.current);
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
   * Initializes connection to peer server
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
     * Listen for a call from connecting peers
     * An incoming call is answered and the current user media
     * (local webcam feed) is sent. Cleans up connection on
     * error or if far side closes connection. Adds peer to peer list.
     */
  const setConnectingPeersListener = () => {
    // /** Casting due to incorrect typescript definitions provided by module
    //* Peer extends EventEmitter */
    // (peerConnection.current as unknown as EventEmitter).removeAllListeners();
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
    const callOption: PeerCallMetadata = {metadata: {user: currentUser}};
    if (!peerConnection.current) throw new Error('Missing peer connection');
    if (!outgoingMedia.current) throw new Error('Missing webcam stream');
    /** Place a call to the external user */
    const call = peerConnection
        .current
        .call(externalUser.id.toString(), outgoingMedia.current, callOption);
    console.log('peer - Placing call', call);
    /** when a stream is received, add it to external media */
    call.on('stream', (stream: MediaStream) => {
      // TODO Check if user ID needs to be updated from
      //  the one provided by websocket to call.peer
      console.log('peer- stream received', stream);
      addPeer(call);
      addExternalMedia(externalUser, stream, callOption);
    });
    /** remove media if connection is closed by far side */
    call.on('close', () => {
      removeMedia(call.peer);
      console.log('call closed', call.metadata.id);
    });
    /** remove media on call error */
    call.on('error', () => {
      console.log('call error: ', call.metadata.id);
      removeMedia(call.peer);
    });
  };

  return (
    <PeerConnectionContext.Provider value={{
      peers,
      setConnectingPeersListener,
      changePeerStream,
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
  changePeerStream: (stream: MediaStream) => void;
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

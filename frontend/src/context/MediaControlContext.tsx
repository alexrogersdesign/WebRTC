/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState} from 'react';
import {CallOption} from 'peerjs';
import {ChildrenProps, IExternalMedia} from '../shared/types';

import User from '../shared/classes/User';
import {RestContext} from './RestContext';
import videoASrc from '../util/files/video/VideoAConverted.mp4';
import videoBSrc from '../util/files/video/VideoBConverted.mp4';
import iconA from '../util/files/img/userA.jpeg';
import iconB from '../util/files/img/userB.jpeg';

/** The Context that handles media and media controls. */
const MediaControlContext = createContext<IMediaControlContext>(undefined!);
/**
 * A context provider for MediaControlContext
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const MediaControlContextProvider: React.FC<ChildrenProps> = ({children}) => {
  const {currentUser, meeting} = useContext(RestContext);

  /** Boolean State indicating the current user has disabled their microphone */
  const [micMuted, setMicMuted] = useState<boolean>(false);
  /** Boolean State indicating the current user has disabled their webcam */
  const [videoDisabled, setVideoDisabled] = useState<boolean>(false);
  /** Boolean State indicating that screen sharing has been enabled */
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  /** An array of MediaStreams and user data each representing a stream received
   * from a peer connection */
  const [externalMedia, setExternalMedia] = useState<IExternalMedia[]>([]);
  /** The media stream from the users webcam */
  const [localMedia, setLocalMedia] = useState<MediaStream>();
  /** Ref representing the video element mirroring the users webcam
   * or shared screen */
  const localVideoRef = useRef<HTMLVideoElement>(null);
  /** A ref of the stream being media stream being transmitted to peers. This is
   * distinguished from localMedia to allow for simple switching between
   * background removal and unaltered webcam streams*/
  const outgoingMedia = useRef<MediaStream>();

  /** Dummy video streams used for demonstrations purposes. */
  const dummyVideoA = useRef(document.createElement('video'));
  const dummyVideoB = useRef(document.createElement('video'));
  const [showDemo, setShowDemo] = useState(false);
  const dummyStreams = useRef<User[]>([]);

  /** Updates the outgoing stream tracks to match the state of the media
   * control parameters */
  const updateStreamMutes = () => {
    if (outgoingMedia.current) {
      outgoingMedia.current.getAudioTracks()[0].enabled = !micMuted;
      outgoingMedia.current.getVideoTracks()[0].enabled = !videoDisabled;
    }
  };

  /** Calls updateStreamMutes() if the state of the media control parameters
   * changes */
  useEffect(() => {
    updateStreamMutes();
  }, [micMuted, videoDisabled]);
  /**
   * Listen for changes in screen sharing
   * If a change is detected, initialize media stream
   * is called to handle the change.
   */
  useEffect( () => {
    meeting && initializeMediaStream();
  }, [screenSharing]);

  /**
   * If the user stops the screen sharing process via the browser API
   * then set screen sharing state to be false.
   */
  useEffect(() => {
    if (!localMedia) {
      setScreenSharing(false);
    }
  }, [localMedia]);

  /**
   * Get audio and video stream from the browser
   * Prompts users for mic and video permissions
   */
  const initializeMediaStream = async () : Promise<MediaStream| undefined> => {
    try {
      let stream;
      /** Retrieves webcam or screen share stream based
       * on screenSharing variable. */
      if (screenSharing) {
        stream = await navigator
            .mediaDevices
            .getDisplayMedia();
        stream
            .getVideoTracks()[0]
            .addEventListener('ended', () => setScreenSharing(false));
      } else {
        stream = await navigator.mediaDevices.getUserMedia( {
          video: true,
          audio: true,
        });
      }
      setLocalMedia(stream);
      outgoingMedia.current = stream;
      /** Stores stream in ref to be used by video element */
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = outgoingMedia.current;
      }
      return stream;
    } catch (err) {
      console.log(err);
      /** Allow user to decline permission prompt */
      if (err instanceof DOMException) {
        screenSharing && setScreenSharing(false);
        !screenSharing && setVideoDisabled(true);
        return;
      }
      throw err;
    }
  };
  /** Cleans up the webcam stream. Disables browser media use indicator */
  const stopWebcamStream = () => {
    localMedia?.getTracks().forEach((track) => track.stop());
  };

  /**
   * Cleans up dummy streams
   * @param {User[]} users An array of the dummy users
   */
  const removeDummyStreams = (users: User[]) => {
    users?.forEach((user)=> removeMedia(user.id.toString()));
  };
  /** Show dummy streams if showDemo is enabled, else
   * clean up streams */
  useEffect(() => {
    if (!showDemo) {
      return removeDummyStreams(dummyStreams.current);
    }
    const createUsers = async () => {
      dummyStreams.current = await createDummyStreams();
    };
    createUsers();
    return () => removeDummyStreams(dummyStreams.current);
  }, [showDemo]);

  const createDummyStreams = async () => {
    const userA = new User('Jarrod', 'Carroll', 'jcarroll@gmail.com');
    const userB = new User('Cathrine', 'Stokes', 'cstokes@gmail.com');
    const userC = new User('Cathrine', 'Stokes', 'cstokes@gmail.com');
    const userD = new User('Cathrine', 'Stokes', 'cstokes@gmail.com');
    dummyVideoA.current.src = videoASrc;
    dummyVideoB.current.src = videoBSrc;
    dummyVideoA.current.load();
    dummyVideoA.current.autoplay = true;
    dummyVideoA.current.loop = true;
    dummyVideoB.current.load();
    dummyVideoB.current.autoplay = true;
    dummyVideoB.current.loop = true;
    userA.icon = iconA.toString();
    userB.icon = iconB.toString();
    addExternalMedia(userA, (dummyVideoA.current as any).captureStream());
    addExternalMedia(userB, (dummyVideoB.current as any).captureStream());
    addExternalMedia(userC, (dummyVideoB.current as any).captureStream());
    addExternalMedia(userD, (dummyVideoB.current as any).captureStream());
    return [userA, userB, userC, userD];
  };
  // const createDummyStreams = async () => {
  //  const userA = new User('Jarrod', 'Carroll', 'jcarroll@gmail.com');
  //  const userB = new User('Cathrine', 'Stokes', 'cstokes@gmail.com');
  //  dummyVideoA.current.src = videoASrc;
  //  dummyVideoB.current.src = videoBSrc;
  //  dummyVideoA.current.load();
  //  dummyVideoA.current.autoplay = true;
  //  dummyVideoA.current.loop = true;
  //  dummyVideoB.current.load();
  //  dummyVideoB.current.autoplay = true;
  //  dummyVideoB.current.loop = true;
  //  userA.icon = iconA.toString();
  //  userB.icon = iconB.toString();
  //  addExternalMedia(userA, (dummyVideoA.current as any).captureStream());
  //  addExternalMedia(userB, (dummyVideoB.current as any).captureStream());
  //  return [userA, userB];
  // };


  /**
   * Helper function to remove a media stream from the
   * list of media streams to display
   * @param {string} id the id of the media to remove
   */
  const removeMedia = (id: string) => {
    setExternalMedia((oldState)=> oldState
        .filter((media:IExternalMedia) => media.user.id.toString() !== id));
  };
  /**
   * Adds media stream to list of streams to display
   * @param {User} user  The peer user information
   * @param {MediaStream} stream the media stream to add
   * @param {any} data? any additional data to be associated with the stream
   */
  const addExternalMedia = (
      user: User,
      stream:MediaStream,
      data?: CallOption,
  ) => {
    if (!currentUser) return;
    /** Prevent local user from being added to the list. */
    if (user.id.toHexString() === currentUser?.id.toHexString()) return;
    const newMediaItem = {
      user, stream, data: data?? undefined,
    };
    console.log('adding media stream from: ', user.fullName);
    setExternalMedia((oldState) => {
      /** Guard against duplicates */
      if (oldState.find((media) =>
        media.user.id.toHexString() === user.id.toHexString())) return oldState;
      return [...oldState, newMediaItem];
    });
  };
  /**
   * Clears all external media streams
   * @return {void}
   */
  const clearExternalMedia = () => setExternalMedia([]);

  return (
    <MediaControlContext.Provider
      value={{
        externalMedia,
        localVideoRef,
        initializeMediaStream,
        setMicMuted,
        setVideoDisabled,
        setScreenSharing,
        micMuted,
        videoDisabled,
        screenSharing,
        outgoingMedia,
        removeMedia,
        addExternalMedia,
        clearExternalMedia,
        localMedia,
        setShowDemo,
        showDemo,
        stopWebcamStream,
        updateStreamMutes,
      }}
    >
      {children}
    </MediaControlContext.Provider>
  );
};

export interface IMediaControlContext {
  externalMedia: IExternalMedia[],
  localVideoRef: React.RefObject<HTMLVideoElement>,
  initializeMediaStream: () => Promise<MediaStream| undefined>,
  setMicMuted: (boolean: boolean) => void,
  setVideoDisabled: (boolean: boolean) => void,
  setScreenSharing: (boolean: boolean) => void,
  micMuted: boolean,
  videoDisabled: boolean,
  screenSharing: boolean,
  localMedia: MediaStream | undefined,
  outgoingMedia: React.MutableRefObject<MediaStream | undefined>,
  removeMedia: (id:string) => void
  addExternalMedia: (user:User, stream:MediaStream, data?:CallOption) => void,
  clearExternalMedia: () => void,
  setShowDemo: (boolean:boolean) => void,
  showDemo: boolean,
  stopWebcamStream: () => void,
  updateStreamMutes: () => void,
}

MediaControlContext.displayName = 'Media Control Context';


export {MediaControlContextProvider, MediaControlContext};

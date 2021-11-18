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
import {RestContext} from './rest/RestContext';
import videoASrc from '../util/files/video/VideoAConverted.mp4';
import videoBSrc from '../util/files/video/VideoBConverted.mp4';
// import iconDir from '../util/files/img/';

import iconA from '../util/files/img/userA.jpeg';
import iconB from '../util/files/img/userB.jpeg';
import * as fs from 'fs';

interface Props extends ChildrenProps {}

const iconAPath = '../util/files/img/userA.jpeg';
const iconBPath = '../util/files/img/userB.jpeg';

//* Context item to be passed to app
const MediaControlContext = createContext<IMediaControlContext>(undefined!);

const MediaControlContextProvider: React.FC<Props> = ({children}) => {
  //* Whether or not the current user has disabled their microphone
  const [micMuted, setMicMuted] = useState<boolean>(false);
  //* Whether or not the current user has disabled their webcam
  const [videoDisabled, setVideoDisabled] = useState<boolean>(false);
  //* Whether or not screen sharing has been enabled
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  //* An array of MediaStreams from all current connections
  const [externalMedia, setExternalMedia] = useState<IExternalMedia[]>([]);

  const [localMedia, setLocalMedia] = useState<MediaStream>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  //* indicate that the video is ready to be rendered
  const [videoReady, setVideoReady] = useState<boolean>(false);

  //* The stream being media stream being transmitted to peers;
  const outgoingMedia = useRef<MediaStream>();
  const {currentUser} = useContext(RestContext);

  //* Dummy video streams used for demonstrations purposes.
  const dummyVideoA = useRef(document.createElement('video'));
  const dummyVideoB = useRef(document.createElement('video'));
  const [showDemo, setShowDemo] = useState(true);
  const dummyStreams = useRef<User[]>([]);

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
  useEffect( () => {
    void initializeMediaStream();
  }, [screenSharing]);

  const screenStream = useRef<MediaStream>();

  useEffect(() => {
    if (!screenStream.current) setScreenSharing(false);
  }, [screenStream.current]);

  /**
     * Get audio and video stream from the browser
     * Will prompt user for permissions
     */
  const initializeMediaStream = async () : Promise<MediaStream| undefined> => {
    try {
      // TODO remove video ready variable
      //* Retrieves webcam or screen share stream based
      //* on screenSharing variable.
      let stream;
      if (screenSharing && screenStream) {
        screenStream.current = stream = await navigator
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
        screenStream.current = undefined;
      }
      setLocalMedia(stream);
      outgoingMedia.current = stream;
      //* stores stream in ref to be used by video element
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      //* replace streams to peers if they exist
      setVideoReady(true);
      return stream;
    } catch (err) {
      console.log(err);
      if (err instanceof DOMException) setScreenSharing(false);
    }
  };

  const removeDummyStreams = (users: User[]) => {
    users.forEach((user)=> removeMedia(user.id.toString()));
  };
  useEffect(() => {
    if (!showDemo) {
      return removeDummyStreams(dummyStreams.current);
    }
    const createUsers = async () => {
      dummyStreams.current = await createDummyStreams();
    };
    void createUsers();
    return () => removeDummyStreams(dummyStreams.current);
  }, [showDemo]);

  const createDummyStreams = async () => {
    const userA = new User('Jarrod', 'Carroll', 'jcarroll@gmail.com');
    const userB = new User('Cathrine', 'Stokes', 'cstokes@gmail.com');
    dummyVideoA.current.src = videoASrc;
    dummyVideoB.current.src = videoBSrc;
    dummyVideoA.current.load();
    dummyVideoA.current.autoplay = true;
    dummyVideoA.current.loop = true;
    dummyVideoB.current.load();
    dummyVideoB.current.autoplay = true;
    dummyVideoB.current.loop = true;
    console.log('type of', typeof iconA);
    console.log('icon A', iconA);
    console.log('icon A Path', iconAPath);
    userA.icon = iconA.toString();
    userB.icon = iconB.toString();
    addExternalMedia(userA, (dummyVideoA.current as any).captureStream());
    addExternalMedia(userB, (dummyVideoB.current as any).captureStream());
    return [userA, userB];
  };


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
     * @param {any} data? any additional data
     */
  const addExternalMedia = (
      user: User, stream:MediaStream, data?: CallOption,
  ) => {
    // TODO check if duplicate users/ or the current user is added to the list.
    if (!currentUser) return;
    //* Prevent local user from being added to the list.
    if (user.id.toHexString() === currentUser.id.toHexString()) return;
    //* Guard against duplicates
    const newMediaItem = {
      user, stream, data: data?? undefined,
    };
    console.log('adding media stream from: ', user.fullName);
    setExternalMedia((oldState) => {
      //* Guard against duplicates
      if (oldState.find((media) =>
        media.user.id.toHexString() === user.id.toHexString())) return oldState;
      return [...oldState, newMediaItem];
    });
  };
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
        videoReady,
        outgoingMedia,
        removeMedia,
        addExternalMedia,
        clearExternalMedia,
        localMedia,
        setShowDemo,
        showDemo,
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
  videoReady: boolean,
  removeMedia: (id:string) => void
  addExternalMedia: (user:User, stream:MediaStream, data?:CallOption) => void,
  clearExternalMedia: () => void,
  setShowDemo: (boolean:boolean) => void,
  showDemo: boolean,
}

MediaControlContext.displayName = 'Media Control Context';


export {MediaControlContextProvider, MediaControlContext};

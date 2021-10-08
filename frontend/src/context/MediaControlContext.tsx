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


interface Props extends ChildrenProps {}

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
    initializeMediaStream();
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
  clearExternalMedia: () => void
}


export {MediaControlContextProvider, MediaControlContext};

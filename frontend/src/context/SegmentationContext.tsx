/* eslint-disable no-unused-vars */
import React, {createContext, useContext, useEffect, useState} from 'react';

import {ChildrenProps} from '../shared/types';
import {MediaControlContext, StreamType} from './MediaControlContext';
import {PeerConnectionContext} from './PeerConnectionContext';
import {
  SegmentationController,
  useSegmentation,
} from '../hooks/useSegmentation';
import {useFirstUpdate} from '../hooks/useFirstUpdate';

/** The context that handles the background segmentation feature */
const SegmentationContext = createContext<ISegmentationContext>(undefined!);


/**
 * A context provider for the segmentation Context
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const SegmentationContextProvider: React.FC<ChildrenProps> = ({
  children,
}) => {
  const {
    localMedia,
    localVideoRef,
    outgoingMedia,
    videoDisabled,
    screenSharing,
    updateStreamMutes,
    streamState,
  } = useContext(MediaControlContext);
  const {changePeerStream} = useContext(PeerConnectionContext);
  /** Used to indicate when segmenting animation should stop */
  /** Boolean state to be set by external components to start segmentation */
  const [removeBackground, setRemoveBackground] = useState<boolean>(false);
  const [firstRender] = useFirstUpdate();

  const [segmentation] = useSegmentation(localMedia);

  /** Disables segmentation if video is disabled
   * and re-enables segmentation when video is enabled again*/
  useEffect(() => {
    if (videoDisabled && segmentation.ready) {
      segmentation.stop();
    }
    if (!videoDisabled && removeBackground) {
      segmentation.start();
    }
  }, [videoDisabled]);

  /** Sets and unsets the background removal process when various app
   * state changes. When screen sharing is enabled, segmentation is
   * stopped temporarily to prevent it from running against the screen
   * sharing feed.*/
  useEffect(() => {
    if (!screenSharing && removeBackground &&
      streamState === StreamType.WEBCAM) {
      segmentation.start();
    } else {
      !firstRender && segmentation.stop();
      if (localVideoRef.current && localMedia &&
        streamState === StreamType.WEBCAM ) {
        console.log('setting media refs');
        outgoingMedia.current = localMedia;
        localVideoRef.current.srcObject = localMedia;
      }
    }
    /** Resynchronize the audio and video mutes */
    updateStreamMutes();
  }, [removeBackground, screenSharing, streamState]);

  useEffect(() => {
    if (!segmentation.ready || !removeBackground) return;
    /** Get audio track from webcam and inject it into canvas feed.  */
    const audioTrack = outgoingMedia.current?.getAudioTracks()[0];
    audioTrack && segmentation.stream.addTrack(audioTrack);
    /** Change outgoing media to segmented stream */
    outgoingMedia.current= segmentation.stream;
    changePeerStream(segmentation.stream);
    if (localVideoRef.current && outgoingMedia.current) {
      localVideoRef.current.srcObject = outgoingMedia.current;
    }
  }, [segmentation.ready]);


  return (
    <SegmentationContext.Provider
      value={{
        segmentation,
        removeBackground,
        setRemoveBackground,
      }}
    >
      {children}
    </SegmentationContext.Provider>
  );
};

SegmentationContext.displayName = 'Segmentation Context';

export {SegmentationContext, SegmentationContextProvider};
export interface ISegmentationContext {
  segmentation: SegmentationController,
  removeBackground: boolean,
  setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>,
}

/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';

import {ChildrenProps} from '../shared/types';
import {MediaControlContext} from './MediaControlContext';
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
    updateStreamMutes,
  } = useContext(MediaControlContext);
  const {changePeerStream} = useContext(PeerConnectionContext);
  /** Used to indicate when segmenting animation should stop */
  /** Boolean state to be set by external components to start segmentation */
  const [removeBackground, setRemoveBackground] = useState<boolean>(false);
  const [firstRender] = useFirstUpdate();

  const [segmentation] = useSegmentation(localMedia);


  /** Sets canvas to a black image if video is disabled while background
   * removal is enabled.  */
  useEffect(() => {
    if (videoDisabled && segmentation.ready) {
      segmentation.stop();
    }
    if (!videoDisabled && removeBackground) {
      segmentation.start();
    }
  }, [videoDisabled]);

  /** Sets and unsets the background removal process when removeBackground state
   * changes. */
  useEffect(() => {
    if (removeBackground) {
      segmentation.start();
    } else {
      !firstRender && segmentation.stop();
      if (localVideoRef.current && localMedia) {
        outgoingMedia.current = localMedia;
        localVideoRef.current.srcObject = outgoingMedia.current;
      }
    }
    /** Resynchronize the audio and video mutes */
    updateStreamMutes();
  }, [removeBackground]);

  const toggleBackgroundRemoval = () => {
    if (!removeBackground) {
      segmentation.start();
    } else {
      !firstRender && segmentation.stop();
      if (localVideoRef.current && localMedia) {
        outgoingMedia.current = localMedia;
        localVideoRef.current.srcObject = outgoingMedia.current;
      }
    }
    /** Resynchronize the audio and video mutes */
    updateStreamMutes();
  };


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

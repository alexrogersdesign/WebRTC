/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from 'react';

import * as bodyPix from '@tensorflow-models/body-pix';


// import * as tf from '@tensorflow/tfjs';
// /** Calling tf.getBackend() is a workaround for a bug where the following
// *  unhandled exemption is thrown:
// *  Unhandled Rejection (Error): No backend found in registry.*/
// tf.getBackend();


import Worker from 'worker-loader!../workers/segmentation.worker';
import {ChildrenProps} from '../shared/types';
import {MediaControlContext} from './MediaControlContext';
import {PeerConnectionContext} from './PeerConnectionContext';
import createCanvasContext from 'canvas-context';
import {useSegmentation} from '../hooks/useSegmentation';
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
    micMuted,
    updateStreamMutes,
  } = useContext(MediaControlContext);
  const {changePeerStream} = useContext(PeerConnectionContext);
  /** Used to indicate when segmenting animation should stop */
  const segmentingStopped = useRef(false);
  /** A boolean state indicating if segmentation is ready to display. */
  const [segmentationReady, setSegmentationReady] = useState(false);
  /** Boolean state to be set by external components to start segmentation */
  const [removeBackground, setRemoveBackground] = useState<boolean>(false);
  /** Reference to a canvas that displays the webcam feed
   *  with the background removed */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  /** The ML model that removes the background */
  const network = useRef<bodyPix.BodyPix>();
  /** A temporary video object created to conform to the Body-Pix API */
  const tempVideo = useRef(document.createElement('video'));
  const [segmentation] = useSegmentation(localMedia);


  /** Sets up the temp video source on first render */
  useEffect(() => {
    if (localMedia) tempVideo.current.srcObject = localMedia;
  }, [localMedia]);

  /** Sets canvas to a black image if video is disabled while background
   * removal is enabled.  */
  useEffect(() => {
    if (videoDisabled) {
      segmentingStopped.current = true;
      const ctx = canvasRef.current?.getContext('2d');
      if (!canvasRef.current) return;
      if (!ctx) return;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
      if (localVideoRef.current && localMedia) {
        segmentation.stop();
        outgoingMedia.current = localMedia;
        localVideoRef.current.srcObject = outgoingMedia.current;
      }
    }
    /** Resynchronize the audio and video mutes */
    updateStreamMutes();
  }, [removeBackground]);


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
        segmentationReady,
        removeBackground,
        setRemoveBackground,
        canvasRef,
      }}
    >
      {children}
    </SegmentationContext.Provider>
  );
};

SegmentationContext.displayName = 'Segmentation Context';

export {SegmentationContext, SegmentationContextProvider};
export interface ISegmentationContext {
  segmentationReady: boolean,
  removeBackground: boolean,
  setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
}

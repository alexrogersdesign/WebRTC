/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';

import * as tf from '@tensorflow/tfjs';
/** Calling tf.getBackend() is a workaround for a bug where the following
 *  unhandled exemption is thrown:
 *  Unhandled Rejection (Error): No backend found in registry.*/
tf.getBackend();

import {ChildrenProps} from '../shared/types';
import {MediaControlContext} from './MediaControlContext';
import {PeerConnectionContext} from './PeerConnectionContext';
import createCanvasContext from 'canvas-context';
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
      processBackground().then(() => setSegmentationReady(true));
    }
  }, [videoDisabled]);

  /** Loads background replacing model when remove background is called */
  useEffect(() => {
    if (removeBackground) {
      processBackground().then(() => setSegmentationReady(true));
    } else {
      if (localVideoRef.current && localMedia) {
        localVideoRef.current.srcObject = localMedia;
      }
    }
  }, [removeBackground]);

  /**
   * Holds the logic for processing the background image of a webcam feed
   * Called every time removeBackground is changed
   * If !removeBackground, the outgoing streams are set to the unaltered webcam
   * stream. Else the background is removed via segmentation and the altered
   * webcam stream is sent outgoing to peers
   * @return {Promise<void>} Promise
   */
  const processBackground = async () => {
    // TODO update request animation frame to render when not focused
    /** The animation request id. Used to stop the background removal
     *  animation process */
    let requestID;
    segmentingStopped.current = false;
    /** If removeBackground is not enabled, cleanup process and
     * reset outgoing stream to the original webcam feed. */
    if (!removeBackground) {
      outgoingMedia.current = localMedia;
      localMedia && changePeerStream(localMedia);
      requestID && cancelAnimationFrame(requestID);
      segmentingStopped.current = true;
      setSegmentationReady(false);
      return;
    }
    /** Load model if its not already loaded */
    if (!network.current) network.current= await bodyPix.load();
    const webcam = tempVideo.current;
    const {videoWidth, videoHeight} = webcam;
    /** Check if canvas ref is rendered on the screen */
    if (!canvasRef.current) {
      const {canvas: newCanvas} = createCanvasContext('2d',
          {
            width: videoWidth,
            height: videoHeight,
            offscreen: false,
          });
      canvasRef.current = newCanvas;
    }
    const canvas = canvasRef.current;
    webcam.width = videoWidth;
    webcam.height = videoHeight;
    /** Resets the video object and loads a new media resource. */
    webcam.load();
    webcam.playsInline= true;
    webcam.autoplay = true;
    /** Begin processing background image */
    const processImage = async () => {
      if (!segmentingStopped.current) {
        requestID = requestAnimationFrame(processImage);
      }
      /** readyState 4 == video is ready, return if video is not */
      if (tempVideo.current.readyState !== 4) return;
      const modelConfig= {
        /** The resolution that determines accuracy (time tradeoff) */
        internalResolution: .25,
        /** To what confidence level background is removed */
        segmentationThreshold: 0.4,
      };
      const model = network.current;
      /** Segment body  */
      const body = await model?.segmentPerson(tempVideo.current, modelConfig);
      if (!body) throw new Error('Failure at segmenting');
      /** Turn segmented body data into a mask image */
      const detectedPersonParts = bodyPix.toMask(body);
      bodyPix.drawMask(
          canvas, //* The destination
          webcam, //* The video source
          detectedPersonParts, //* Person parts detected in the video
          1, //* The opacity value of the mask
          9, //* The amount of blur
          false, //* If the output video should be flipped horizontally
      );
    };
    /** When an onloadeddata event is received, begin processing background
     * removal animation. */
    tempVideo.current.onloadeddata = () => {
      requestID = requestAnimationFrame(processImage);
    };
    /** Cancels animation */
    requestID && cancelAnimationFrame(requestID);
    const canvasStream = canvas?.captureStream();
    if (!canvasStream) {
      throw new Error('Could not capture stream after segmentation attempt');
    }
    /** Get audio track from webcam and inject it into canvas feed.  */
    const audioTrack = outgoingMedia.current?.getAudioTracks()[0];
    audioTrack && canvasStream.addTrack(audioTrack);
    /** Synchronize audio mute state with canvas stream
     * this prevents the stream from enabling audio when it is
     * replaced*/
    canvasStream.getAudioTracks()[0].enabled =!micMuted;
    /** Change outgoing media to segmented stream */
    changePeerStream(canvasStream);
    outgoingMedia.current= canvasStream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = canvasStream;
    }
  };

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

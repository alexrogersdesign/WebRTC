/* eslint-disable max-len */
import React, {useEffect, useState, useRef, createContext} from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';
tf.getBackend();

import {ISegmentationContext, ChildrenProps} from '../types';

const SegmentationContext = createContext<Partial<ISegmentationContext>>({});

interface Props extends ChildrenProps {
  // context: React.Context<ISocketIOContext>
  localMedia: MediaStream | undefined,
  outgoingMedia: React.MutableRefObject<MediaStream | undefined>,
  changePeerStream: (stream: MediaStream) => void,
  // tempVideo: React.MutableRefObject<HTMLVideoElement>
}

const SegmentationContextProvider: React.FC<Props> = ({
  localMedia,
  changePeerStream,
  outgoingMedia,
  // tempVideo,
  children,
}) => {
  // a variable used to stop the segmenting animation from running
  const segmentingStopped = useRef(false);
  const [segmentationReady, setSegmentationReady] = useState(false);
  const [removeBackground, setRemoveBackground] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const network = useRef<bodyPix.BodyPix>();
  const tempVideo = useRef(document.createElement('video'));


  // const {localMedia, changePeerStream, outgoingMedia} = useContext(context);

  useEffect(() => {
    if (localMedia) tempVideo.current.srcObject = localMedia;
  }, [localMedia]);

  /**
   * Loads background replacing model
   */
  useEffect(() => {
    segmentVideo();
    ;
  }, [removeBackground]);

  const segmentVideo = async () => {
    // TODO update request animation frame to render when not focused
    let requestID;
    segmentingStopped.current = false;
    /**
      * Check if removeBackground is true.
      * If not, cleanup process and reset outgoing treams to the original camera feed.
      */
    if (!removeBackground) {
      outgoingMedia.current = localMedia;
      localMedia && changePeerStream(localMedia);
      requestID && cancelAnimationFrame(requestID);
      segmentingStopped.current = true;
      setSegmentationReady(false);
      return;
    };
    if (!network.current) network.current= await bodyPix.load();

    const webcam = tempVideo.current;
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    webcam.width = canvas.width = webcam.videoWidth;
    webcam.height = canvas.height = webcam.videoHeight;
    webcam.load();
    webcam.playsInline= true;
    webcam.autoplay = true;

    if (!network.current) throw new Error('model not loaded');
    const processImage = async () => {
      if (!segmentingStopped.current) requestID = requestAnimationFrame(processImage);
      if (tempVideo.current.readyState !== 4) return;
      const modelConfig= {
        internalResolution: .25, // how accurate the model is (time tradeoff)
        segmentationThreshold: 0.7, // to what confidence level background is removed
      };
      console.log('tempVideo', tempVideo.current);
      const body = await network.current?.segmentPerson(tempVideo.current, modelConfig);
      if (!body) throw new Error('Failure at segmenting');
      const detectedPersonParts = bodyPix.toMask(body);
      bodyPix.drawMask(
          canvas, // The destination
          webcam, // The video source
          detectedPersonParts, // Person parts detected in the video
          1, // The opacity value of the mask
          9, // The amount of blur
          false, // If the output video should be flipped horizontally
      );
    };
    // Check if video is ready
    tempVideo.current.onloadeddata = () => requestID = requestAnimationFrame(processImage);
    // requestID = requestAnimationFrame(processImage);
    // cancel animation
    if (requestID) cancelAnimationFrame(requestID);
    const canvasStream = canvasRef.current?.captureStream();
    if (!canvasStream) {
      throw new Error('No canvas found after segmentation attempt');
    };
    setSegmentationReady(true);
    changePeerStream(canvasStream);
    outgoingMedia.current= canvasStream;
  };

  return (
    <SegmentationContext.Provider
      value={{
        segmentationReady,
        removeBackground,
        setRemoveBackground,
        tempVideo,
        canvasRef,
      }}
    >
      {children}
    </SegmentationContext.Provider>
  );
};

export {SegmentationContext, SegmentationContextProvider};

import React, {useEffect, useState, useRef, createContext} from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';
tf.getBackend();

import {ISegmentationContext, ChildrenProps} from '../types';

interface Props extends ChildrenProps {
  localMedia: MediaStream | undefined,
  outgoingMedia: React.MutableRefObject<MediaStream | undefined>,
  changePeerStream: (stream: MediaStream) => void,
}

const SegmentationContext = createContext<Partial<ISegmentationContext>>({});

const SegmentationContextProvider: React.FC<Props> = ({
  localMedia,
  changePeerStream,
  outgoingMedia,
  children,
}) => {
  //* Used to indicate when segmenting animation should stop
  const segmentingStopped = useRef(false);
  //* Tells component that segmentation is ready to be displayed
  const [segmentationReady, setSegmentationReady] = useState(false);
  //* State that is changed by external components to start segmentation
  const [removeBackground, setRemoveBackground] = useState<boolean>(false);
  //* Reference to a canvas that displayed the background removal
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //* The ML model that removes the background
  const network = useRef<bodyPix.BodyPix>();
  //* A temporary video object created to conform to the Body-Pix API
  const tempVideo = useRef(document.createElement('video'));

  //* sets the temp video source on first render
  useEffect(() => {
    if (localMedia) tempVideo.current.srcObject = localMedia;
  }, [localMedia]);

  //* Loads background replacing model
  useEffect(() => {
    processBackground();
    ;
  }, [removeBackground]);
  /**
   * Holds the logic for processing the background image of a webcam feed
   * Called every time removeBackground is changed
   * If !removeBackground, the outgoing streams are set to the unaltered webcam
   * stream. Else the background is removed via segmentation and the altered
   * webcam stream is sent outgoing to peers
   * @return {void} void
   */
  const processBackground = async () => {
    // TODO update request animation frame to render when not focused
    let requestID;
    segmentingStopped.current = false;
    //* Check if removeBackground is true.
    //* If not, cleanup process and reset outgoing steams
    //* to the original camera feed.
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
      if (!segmentingStopped.current) {
        requestID = requestAnimationFrame(processImage);
      }
      if (tempVideo.current.readyState !== 4) return;
      const modelConfig= {
        //* The resolution that determines accuracy (time tradeoff)
        internalResolution: .25,
        //* To what confidence level background is removed
        segmentationThreshold: 0.7,
      };
      const model = network.current;
      const body = await model?.segmentPerson(tempVideo.current, modelConfig);
      if (!body) throw new Error('Failure at segmenting');
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
    //* Start animation if video is ready
    tempVideo.current.onloadeddata = () => {
      requestID = requestAnimationFrame(processImage);
    };
    //* Cancel animation
    if (requestID) cancelAnimationFrame(requestID);
    const canvasStream = canvasRef.current?.captureStream();
    if (!canvasStream) {
      throw new Error('Could not capture stream after segmentation attempt');
    };
    setSegmentationReady(true);
    //* Change outgoing media to segmented stream
    changePeerStream(canvasStream);
    const audioTrack = outgoingMedia.current?.getAudioTracks()[0];
    // const newVideo = canvasStream.getVideoTracks()[0];
    audioTrack && canvasStream.addTrack(audioTrack);
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

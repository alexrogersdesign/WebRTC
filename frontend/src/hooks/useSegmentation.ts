/* eslint-disable no-unused-vars */
import {useState, useEffect, useRef} from 'react';
import * as workerTimers from 'worker-timers';
import createCanvasContext from 'canvas-context';


import Worker from 'worker-loader!../workers/segmentation.worker';
import {ReturnEvent} from '../workers/segmentation.worker';
import {
  BodypixWorkerManager, createForegroundImage,
  generateBodyPixDefaultConfig,
  generateDefaultBodyPixParams, SemanticPersonSegmentation,
} from '@dannadori/bodypix-worker-js';

const config = generateBodyPixDefaultConfig();
const params = generateDefaultBodyPixParams();
/** The resolution that determines accuracy (time tradeoff) */
params.segmentPersonParams.internalResolution = .25;
/** To what confidence level background is removed */
params.segmentPersonParams.segmentationThreshold = .4;

const useSegmentation = (stream: MediaStream| undefined) => {
  const segmentationWorker = useRef(new Worker());
  const timeoutID= useRef<number| null>(null);
  const [segmentationReady, setSegmentationReady] = useState(false);
  const outGoingStream = useRef<MediaStream| null>(null);
  const srcCanvas = useRef<HTMLCanvasElement>(null!);
  const dstCanvas = useRef<HTMLCanvasElement>(null!);
  const tempVideo = useRef(document.createElement('video'));

  const manager = useRef(new BodypixWorkerManager());
  const start = () => {
    if (!stream) return;

    const streamVideoTrack = stream.getVideoTracks()[0];
    const {height, width} = streamVideoTrack.getSettings();
    if (!width || !height) {
      throw new Error('unable to retrieve width or height from ' +
        'supplied stream ');
    }
    if (!srcCanvas.current) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      srcCanvas.current = canvas;
    }
    if (!dstCanvas.current) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      dstCanvas.current = canvas;
    }
    tempVideo.current.srcObject = stream;
    tempVideo.current.autoplay = true;
    tempVideo.current.height = height;


    const runWorker = async () => {
      // const imageCapture = new ImageCapture(streamVideoTrack);
      // const image = await imageCapture.grabFrame();
      const context = srcCanvas.current.getContext('2d');
      context?.drawImage(tempVideo.current, 0, 0, width, height);
      const pred = await manager.current
          .predict(srcCanvas.current, params);
      const foreground = createForegroundImage(
          srcCanvas.current,
          pred as SemanticPersonSegmentation,
      );
      dstCanvas.current.getContext('2d')?.putImageData(foreground, 0, 0);
      !segmentationReady && renderStream();
      timeoutID.current = workerTimers.setTimeout(runWorker, 1000 / 30);
      // segmentationWorker.current.postMessage(
      //    {action: 'start', image},
      //    [image],
      // );
    };

    tempVideo.current.onloadeddata = async () => {
      await manager.current.init(config);
      timeoutID.current = workerTimers.setTimeout(runWorker, 1000 / 30);
    };
  };
  const stop = () => {
    timeoutID.current && workerTimers.clearTimeout(timeoutID.current);
    setSegmentationReady(false);
  };
  // useEffect(() => {
  //  segmentationWorker.current.onmessage = (event:ReturnEvent) => {
  //    const {image} = event.data;
  //    const context = dstCanvas.current.getContext('2d');
  //    context?.drawImage(image, 0, 0);
  //    console.log('received event from worker ');
  //    !segmentationReady && renderStream();
  //  };
  //  segmentationWorker.current.onerror = (event:ErrorEvent) => {
  //    console.log(event);
  //    timeoutID.current && workerTimers.clearTimeout(timeoutID.current);
  //  };
  // }, [segmentationWorker.current]);

  const renderStream = async () => {
    const capturedStream = await dstCanvas.current.captureStream();
    if (capturedStream) {
      outGoingStream.current = capturedStream;
      setSegmentationReady(true);
    }
  };
  interface Controls {
    start: ()=> void;
    stop: ()=> void;
  }
  interface ValidStream extends Controls {
    ready: true;
    stream: MediaStream;
  }
  interface InvalidStream extends Controls {
    ready: false;
    stream: null;
  }
  type Controller = ValidStream | InvalidStream;
  const segmentationController = {
    stream: outGoingStream.current,
    ready: segmentationReady,
    stop,
    start,
  };


  return [segmentationController as Controller] as const;
};

export {useSegmentation};

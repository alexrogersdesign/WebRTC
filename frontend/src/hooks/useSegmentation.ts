/* eslint-disable no-unused-vars */
import {useState, useEffect, useRef} from 'react';
import * as workerTimers from 'worker-timers';


import {
  BodypixWorkerManager, createForegroundImage,
  generateBodyPixDefaultConfig,
  generateDefaultBodyPixParams,
  SemanticPersonSegmentation,
} from '@dannadori/bodypix-worker-js';
import * as bodyPix from '@tensorflow-models/body-pix';

const config = generateBodyPixDefaultConfig();
// config.useTFWasmBackend = true;
const params = generateDefaultBodyPixParams();
/** The resolution that determines accuracy (time tradeoff) */
params.segmentPersonParams.internalResolution = 'low';
/** To what confidence level background is removed */
params.segmentPersonParams.segmentationThreshold = .3;
params.type = 0;
params.processHeight = 480;
params.processWidth = 640;


const useSegmentation = (inputStream: MediaStream| undefined) => {
  const [segmentationReady, setSegmentationReady] = useState(false);
  const [segmentationStarting, setSegmentationStarting] = useState(false);
  const segmentationStopped = useRef<boolean>();
  const outputStream = useRef<MediaStream| null>(null);
  const timeoutID= useRef<number>(null!);
  const srcCanvas = useRef<HTMLCanvasElement>(null!);
  const dstCanvas = useRef<HTMLCanvasElement>(null!);
  const tempVideo = useRef(document.createElement('video'));

  useEffect(() => {
    console.log('segmentation set to stopped?: ', segmentationStopped.current);
  }, [segmentationStopped.current]);

  useEffect(() => {
    console.log('seg ready: ', segmentationReady);
  }, [segmentationReady]);


  const manager = useRef(new BodypixWorkerManager());

  const stopCycle = () => {
    try {
      timeoutID.current && workerTimers.clearTimeout(timeoutID.current);
      // clearTimeout();
    } catch (e) {
      if (e instanceof Error) {
        console.error(JSON.stringify(e.stack));
      }
    }
  };

  const start = () => {
    console.log('start called');
    if (!inputStream) return;
    segmentationStopped.current = false;
    setSegmentationStarting(true);

    const streamVideoTrack = inputStream.getVideoTracks()[0];
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
    tempVideo.current.srcObject = inputStream;
    tempVideo.current.height = height;
    tempVideo.current.width = width;
    tempVideo.current.autoplay = true;


    const runWorker = async () => {
      const context = srcCanvas.current.getContext('2d');
      context?.drawImage(tempVideo.current, 0, 0, width, height);
      const pred = await manager.current
          .predict(srcCanvas.current, params);
      // const detectedPersonParts = bodyPix
      //    .toMask(pred as SemanticPersonSegmentation);
      // const foreground = createForegroundImage(
      //    srcCanvas.current,
      //    pred as SemanticPersonSegmentation,
      // );
      // dstCanvas.current.getContext('2d')?.putImageData(foreground, 0, 0);
      bodyPix.drawBokehEffect(
          dstCanvas.current, //* The destination
          tempVideo.current, //* The video source
           pred as SemanticPersonSegmentation,
           14,
           10,
      );
      !segmentationReady && renderStream();
      setSegmentationStarting(false);
      if (!segmentationStopped.current) {
        timeoutID.current = workerTimers.setTimeout(runWorker, 1000 / 60);
      }
    };

    tempVideo.current.onloadeddata = async () => {
      await manager.current.init(config);
      console.log('video loaded');
      runWorker();
    };
  };
  const stop = () => {
    console.log('stop called');
    stopCycle();
    segmentationStopped.current = true;
    setSegmentationReady(false);
  };

  const renderStream = async () => {
    const capturedStream = await dstCanvas.current.captureStream();
    if (capturedStream && !segmentationStopped.current) {
      outputStream.current = capturedStream;
      setSegmentationReady(true);
    }
  };

  const segmentationController = {
    stream: outputStream.current,
    ready: segmentationReady,
    stop,
    start,
    starting: segmentationStarting,
  };


  return [segmentationController as SegmentationController] as const;
};

interface Controls {
  start: ()=> void;
  stop: ()=> void;
}
interface ValidStream extends Controls {
  starting: false;
  ready: true;
  stream: MediaStream;
}
interface InvalidStream extends Controls {
  starting: boolean
  ready: false;
  stream: null;
}
export type SegmentationController = ValidStream | InvalidStream;

export {useSegmentation};

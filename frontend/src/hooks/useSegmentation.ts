/* eslint-disable no-unused-vars */
import {useState, useRef} from 'react';
import * as workerTimers from 'worker-timers';


import {
  BodypixWorkerManager,
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
  /** Represents whether the segmentation process has completed a frame
   * and the stream is ready */
  const [segmentationReady, setSegmentationReady] = useState(false);
  /** Represents whether the segmentation process has started but the
   * stream is not ready */
  const [segmentationLoading, setSegmentationLoading] = useState(false);
  /** Represents whether the segmentation process has been manually stopped  */
  const segmentationStopped = useRef<boolean>();
  /** The output stream of the segmented video */
  const outputStream = useRef<MediaStream| null>(null);
  /** The timeoutID of the timeout process that controls the timing
   * of the recursive runWorker function */
  const timeoutID= useRef<number>(null!);
  /** The source canvas that is supplied to ML algorithm
   * to make predictions against*/
  const srcCanvas = useRef<HTMLCanvasElement>(null!);
  /** The destination canvas that the removed background and composited
   * foreground image are drawn onto */
  const dstCanvas = useRef<HTMLCanvasElement>(null!);
  /** A temp video element used as a source to the srcCanvas and is also
   * used in the masking process*/
  const tempVideo = useRef(document.createElement('video'));

  const manager = useRef(new BodypixWorkerManager());

  const stopCycle = () => {
    try {
      timeoutID.current && workerTimers.clearTimeout(timeoutID.current);
    } catch (e) {
      if (e instanceof Error) {
        console.error(JSON.stringify(e.stack));
      }
    }
  };
  /**
   * A start function called externally to start the segmentation process.
   */
  const start = () => {
    if (!inputStream) return;
    segmentationStopped.current = false;
    setSegmentationLoading(true);

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

    /**
     * Run the recursive segmentation process. The process is run in a
     * web worker to prevent delaying the main browser thread.
     * @return {Promise<void>}
     */
    const runWorker = async () => {
      const context = srcCanvas.current.getContext('2d');
      context?.drawImage(tempVideo.current, 0, 0, width, height);
      const pred = await manager.current.predict(srcCanvas.current, params);
      /** Blurs the background and draws the segmentation prediction data
       * into a mask on top of the destination canvas. The local video source
       * is used to retrieve the foreground data instead of the src canvas. This
       * allows the latency apply only to segmentation mask and not the actual
       * video feed since the src canvas was drawn at the beginning of the
       * runWorker cycle. This means that the srcCanvas has a latency equivalent
       * to the time taken by the segmentation process and should not be used
       * as the video source for the foreground.*/
      bodyPix.drawBokehEffect(
          dstCanvas.current, //* The destination
          tempVideo.current, //* The input source
           pred as SemanticPersonSegmentation, //* The segmentation prediction
           14, //* The background blur amount
           10, //* the edge blur amount
      );
      !segmentationReady && renderStream();
      setSegmentationLoading(false);
      if (!segmentationStopped.current) {
        timeoutID.current = workerTimers.setTimeout(runWorker, 1000 / 60);
      }
    };
    /** When the tempVideo has loaded and is ready to be displayed,
     * start the segmentation process */
    tempVideo.current.onloadeddata = async () => {
      await manager.current.init(config);
      runWorker();
    };
  };
  /** A function that can be externally called to stop the segmentation
   * process */
  const stop = () => {
    stopCycle();
    segmentationStopped.current = true;
    setSegmentationReady(false);
  };
  /** Called when the segmentation process is at a point where the stream can
   * begin to be captured.*/
  const renderStream = async () => {
    const capturedStream = await dstCanvas.current.captureStream();
    if (capturedStream && !segmentationStopped.current) {
      outputStream.current = capturedStream;
      setSegmentationReady(true);
    }
  };
  /** An object representing the state of the segmentation process  */
  const segmentationController = {
    stream: outputStream.current,
    ready: segmentationReady,
    stop,
    start,
    loading: segmentationLoading,
  };

  return [segmentationController as SegmentationController] as const;
};

interface Controls {
  start: ()=> void;
  stop: ()=> void;
}
interface ValidStream extends Controls {
  loading: false;
  ready: true;
  stream: MediaStream;
}
interface InvalidStream extends Controls {
  loading: boolean
  ready: false;
  stream: null;
}
export type SegmentationController = ValidStream | InvalidStream;

export {useSegmentation};

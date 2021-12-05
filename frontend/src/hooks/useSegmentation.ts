/* eslint-disable no-unused-vars */
import {useState, useEffect, useRef} from 'react';
import * as workerTimers from 'worker-timers';
import createCanvasContext from 'canvas-context';


import Worker from 'worker-loader!../workers/segmentation.worker';
import {ReturnEvent} from '../workers/segmentation.worker';


const useSegmentation = (stream: MediaStream| undefined) => {
  const segmentationWorker = useRef(new Worker());
  const intervalID= useRef<number| null>(null);
  const [segmentationReady, setSegmentationReady] = useState(false);
  const outGoingStream = useRef<MediaStream| null>(null);
  const onScreenCanvas = useRef<HTMLCanvasElement>(null!);

  const start = () => {
    if (!stream) return;
    const streamVideoTrack = stream.getVideoTracks()[0];
    const {height, width} = streamVideoTrack.getSettings();
    if (!onScreenCanvas.current) {
      const canvas = document.createElement('canvas');
      if (!width || !height) {
        throw new Error('unable to retrieve width or height from ' +
        'supplied stream ');
      }
      canvas.width = width;
      canvas.height = height;
      onScreenCanvas.current = canvas;
    }

    const runWorker = async () => {
      const imageCapture = new ImageCapture(streamVideoTrack);
      const image = await imageCapture.grabFrame();
      segmentationWorker.current.postMessage(
        {action: 'start', image},
        [image],
      );
    };
    intervalID.current = workerTimers.setInterval(runWorker, 1000 / 30);
  };
  const stop = () => {
    intervalID.current && workerTimers.clearInterval(intervalID.current);
    setSegmentationReady(false);
  };
  useEffect(() => {
    segmentationWorker.current.onmessage = (event:ReturnEvent) => {
      const {image} = event.data;
      const context = onScreenCanvas.current.getContext('2d');
      context?.drawImage(image, 0, 0);
      console.log('received event from worker ');
      !segmentationReady && renderStream();
    };
    segmentationWorker.current.onerror = (event:ErrorEvent) => {
      console.log(event);
      intervalID.current && workerTimers.clearInterval(intervalID.current);
    };
  }, [segmentationWorker.current]);

  const renderStream = async () => {
    const capturedStream = await onScreenCanvas.current.captureStream();
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

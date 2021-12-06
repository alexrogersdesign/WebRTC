import * as bodyPix from '@tensorflow-models/body-pix';
// eslint-disable-next-line no-unused-vars
import type {BodyPix} from '@tensorflow-models/body-pix';
// const bodyPix = require('@tensorflow-models/body-pix');
// const {BodyPix} = require('@tensorflow-models/body-pix');
// const createCanvasContext = require('canvas-context');

import * as tf from '@tensorflow/tfjs';
/** Calling tf.getBackend() is a workaround for a bug where the following
 *  unhandled exemption is thrown:
 *  Unhandled Rejection (Error): No backend found in registry.*/
tf.getBackend();

let model: BodyPix = null!;

const worker: Worker = self as any;


const beginSegmentation = async (image: ImageBitmap) => {
  if (!model) model= await bodyPix.load();
  const {width, height} = image;
  const inputCanvas = new OffscreenCanvas(width, height);
  const renderer = inputCanvas.getContext('bitmaprenderer');
  renderer?.transferFromImageBitmap(image);
  const outputCanvas = new OffscreenCanvas(width, height);
  /** Check if canvas ref is rendered on the screen */
  /** Resets the video object and loads a new media resource. */
  /** Begin processing background image */
  const modelConfig= {
    /** The resolution that determines accuracy (time tradeoff) */
    internalResolution: .25,
    /** To what confidence level background is removed */
    segmentationThreshold: 0.4,
  };
    /** Segment body  */
  const body = await model?.segmentPerson(inputCanvas, modelConfig);
  if (!body) throw new Error('Failure at segmenting');
  /** Turn segmented body data into a mask image */
  const detectedPersonParts = bodyPix.toMask(body);
  bodyPix.drawMask(
      outputCanvas, //* The destination
      inputCanvas, //* The video source
      detectedPersonParts, //* Person parts detected in the video
      1, //* The opacity value of the mask
      9, //* The amount of blur
      false, //* If the output video should be flipped horizontally
  );
  const returnImage = outputCanvas.transferToImageBitmap();
  worker.postMessage({image: returnImage}, [returnImage]);
};


worker.onmessage = async (e: SegmentationWorkerEvent) => {
  switch (e.data.action) {
    case 'start':
      const {image} = e.data;
      await beginSegmentation(image);
      break;
    case 'stop':
  }
};

export {worker};
type StartData = {
  action: 'start';
  image: ImageBitmap,
}
type StopData = {
  action: 'stop';
  image: never,
}

interface SegmentationWorkerEvent {
  data: StartData | StopData;
}

export interface ReturnEvent {
  data: {
    image :ImageBitmap;
  }
}

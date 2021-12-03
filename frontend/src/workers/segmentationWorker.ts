import * as bodyPix from '@tensorflow-models/body-pix';
import createCanvasContext from 'canvas-context';

const model = await bodyPix.load();

interface SegmentationWorkerEvent {
    data: {
        video: HTMLVideoElement,
    }
}

const worker: Worker = self as any;

let requestID: number;

worker.onmessage = async (e: SegmentationWorkerEvent) => {
  // TODO update request animation frame to render when not focused
  const {video} = e.data;

  const segmentingStopped = false;
  /** The animation request id. Used to stop the background removal
     *  animation process */
  /** If removeBackground is not enabled, cleanup process and
     * reset outgoing stream to the original webcam feed. */
  /** Load model if its not already loaded */
  const {videoWidth, videoHeight} = video;
  /** Check if canvas ref is rendered on the screen */
  const {canvas} = createCanvasContext('2d',
      {
        width: videoWidth,
        height: videoHeight,
        offscreen: false,
        worker: true,
      });
  video.width = videoWidth;
  video.height = videoHeight;
  /** Resets the video object and loads a new media resource. */
  video.load();
  video.playsInline= true;
  video.autoplay = true;
  /** Begin processing background image */
  const processImage = async () => {
    if (!segmentingStopped) {
      requestID = requestAnimationFrame(processImage);
    }
    /** readyState 4 == video is ready, return if video is not */
    if (video.readyState !== 4) return;
    const modelConfig= {
      /** The resolution that determines accuracy (time tradeoff) */
      internalResolution: .25,
      /** To what confidence level background is removed */
      segmentationThreshold: 0.4,
    };
    /** Segment body  */
    const body = await model?.segmentPerson(video, modelConfig);
    if (!body) throw new Error('Failure at segmenting');
    /** Turn segmented body data into a mask image */
    const detectedPersonParts = bodyPix.toMask(body);
    bodyPix.drawMask(
        canvas, //* The destination
        video, //* The video source
        detectedPersonParts, //* Person parts detected in the video
        1, //* The opacity value of the mask
        9, //* The amount of blur
        false, //* If the output video should be flipped horizontally
    );
  };
    /** When an onloadeddata event is received, begin processing background
     * removal animation. */
  video.onloadeddata = () => {
    requestID = requestAnimationFrame(processImage);
  };
  /** Cancels animation */
  requestID && cancelAnimationFrame(requestID);
  self.postMessage({canvas, requestID});
};


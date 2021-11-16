declare module '*.mp4';
declare module '*.jpeg';
declare module '*.m4v';

// eslint-disable-next-line no-unused-vars
declare interface HTMLMediaElementWithCaptureStream extends HTMLMediaElement{
    captureStream(): MediaStream;
}

/* eslint-disable no-unused-vars */
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {Paper, useTheme} from '@material-ui/core';

import WebcamControls from './WebcamControls';
import {MediaControlContext, StreamType,
} from '../../context/MediaControlContext';
import {useVideoStyles} from './VideoPlayer';
import clsx from 'clsx';
import {AppStateContext} from 'src/context/AppStateContext';
import {LOCAL_VIDEO_WIDTH} from '../../util/constants';

export interface LocalVideoProps {
  style?: React.CSSProperties
  hideControls?: boolean;
}

/**
 * Renders a local video element which acts as webcam preview displaying
 * the users outgoing webcam feed.
 * @param {boolean} videoLoading A boolean indicating whether the video is
 * loading or ready to displayed. When loading is true, the webcam preview
 * is hidden and a loading animation is shown.
 * @param {React.CSSProperties} style A set of CSS styles to apply to the
 * root element.
 * @return {JSX.Element}
 * @constructor
 */
export function LocalVideo({
  style,
  hideControls,
}: LocalVideoProps) {
  const {
    localVideoRef,
    outgoingMedia,
    streamState,
    videoDisabled,
  } = useContext(MediaControlContext);
  /** A boolean indicating if the video is loading and should
   *  not be displayed */
  const [videoLoading, setVideoLoading] = useState(false);
  const videoClasses = useVideoStyles({videoLoading, hideControls});
  const {videoDrawerOpen} = useContext(AppStateContext);
  const theme = useTheme();


  /** When the video drawer open stage changes check if the
   * video element readyState is 0 (meaning it has no media set).
   * If so, set the srcObject to the outgoing stream */
  useEffect(() => {
    if (localVideoRef.current?.readyState === 0) {
      if (localVideoRef.current && outgoingMedia) {
        localVideoRef.current.srcObject = outgoingMedia;
      }
    }
  }, [videoDrawerOpen]);

  /**
   * A function that returns CSS properties for
   * the video element. The function is memoized with useCallback to prevent
   * spending unnecessary resources.
   * @return {React.CSSProperties} The css properties to apply to the style
   * prop of the element.
   */
  const getVideoStyle = useCallback( () : React.CSSProperties => {
    const isWebcam = streamState === StreamType.WEBCAM;
    const transform = isWebcam?
      'rotateY(180deg)': undefined;
    const height = !isWebcam? 200: 240;
    const width = LOCAL_VIDEO_WIDTH;
    const transition = theme.transitions.create(['height', 'margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.complex,
    });
    return {transform, height, transition, width};
  }, [streamState, theme]);

  /**
   * The video style prop passed to the video element. This
   * is used to make sure the video re-renders when the state
   * changes.
   */
  const [videoStyle, setVideoStyle] = useState(getVideoStyle());

  /** Set the video loading  whenever the outgoing media changes.
   * After a set amount of time, set transitioning to false. This is
   * used to create a more natural transition when video sources are loading
   * and prevents the video element from "blinking" when changing between
   * sources*/
  useLayoutEffect(() => {
    setVideoLoading(true);
    setTimeout(() => setVideoLoading(false), 1000);
  }, [outgoingMedia]);

  /** Update the style of the video element before browser paint */
  useLayoutEffect(() => {
    setVideoStyle(getVideoStyle());
  }, [streamState, theme]);

  const hideVideo = videoDisabled || videoLoading;
  return (
    <div
      className={clsx(videoClasses.localContainer, videoClasses.container)}
      style={style}
    >
      <Paper className={videoClasses.paper} elevation={3} variant="outlined" >
        <video
          className={clsx( videoClasses.video, {
            [videoClasses.hide]: hideVideo,
          })}
          style={videoStyle}
          ref={localVideoRef}
          playsInline
          muted
          autoPlay
          width={LOCAL_VIDEO_WIDTH}
          onCanPlay={() => setVideoLoading(false)}
        />
        <canvas
          style={videoStyle}
          className={clsx( {
            [videoClasses.hide]: !hideVideo,
          })}
        />
        <WebcamControls className={videoClasses.controls}/>
      </Paper>
    </div>
  );
}
/**
 * A memoized version of the LocalVideo component.
 * @type {React.NamedExoticComponent<LocalVideo>}
 */
export const MemoizedLocalVideo = React.memo(LocalVideo);

/* eslint-disable no-unused-vars */
import React, {useContext, useEffect} from 'react';
import {CircularProgress, Paper} from '@material-ui/core';
import WebcamControls from './WebcamControls';
import {SegmentationContext} from '../../context/SegmentationContext';
import {MediaControlContext} from '../../context/MediaControlContext';
import {VideoClasses, VideoProps} from './VideoPlayer';
import clsx from 'clsx';
import {AppStateContext} from 'src/context/AppStateContext';
import {LOCAL_VIDEO_WIDTH} from '../../util/constants';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

interface LocalVideoClasses extends VideoClasses {
  localContainer?: string;
  localVideo?: string;
}
export interface LocalVideoProps extends VideoProps {
  propClasses: LocalVideoClasses
}

const useStyles = makeStyles<Theme>((theme: Theme) =>
  createStyles({
    video: {
      width: LOCAL_VIDEO_WIDTH,
      height: 'auto',
    },
  }),
);

/**
 * Renders a local video element which acts as webcam preview displaying
 * the users outgoing webcam feed.
 * @param {boolean} videoLoading A boolean indicating whether the video is
 * loading or ready to displayed. When loading is true, the webcam preview
 * is hidden and a loading animation is shown.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setVideoLoading
 * A function to set the video loading state.
 * @param {LocalVideoClasses} propClasses An object representing Css classes
 * to pass to the internal components.
 * @return {JSX.Element}
 * @constructor
 */
export function LocalVideo({
  videoLoading,
  setVideoLoading,
  propClasses,
}: LocalVideoProps) {
  const classes= useStyles();
  const {
    canvasRef,
    removeBackground,
    segmentationReady,
  } = useContext(SegmentationContext);
  const {localVideoRef, localMedia} = useContext(MediaControlContext);
  const {videoDrawerOpen} = useContext(AppStateContext);

  /** Set video loading to true on first render */
  useEffect(() => {
    setVideoLoading(true);
  }, []);
  /** If the video element readyState is 0 (meaning it has no media set),
   * then set the srcObject to the localMedia stream */
  useEffect(() => {
    if (localVideoRef.current?.readyState === 0) {
      if (localVideoRef.current && localMedia) {
        localVideoRef.current.srcObject = localMedia;
      }
    }
  }, [videoDrawerOpen]);


  const showBackground = !(removeBackground && segmentationReady);
  return (
    <div className={clsx(propClasses.localContainer, propClasses.container)}>
      {videoLoading &&(
        <CircularProgress
          className={propClasses.progress}
          size={80}
          thickness={4}
          disableShrink
          classes={{
            circle: propClasses.circle,
          }}
        />
      )}
      <Paper className={propClasses.paper} elevation={3} variant="outlined" >
        <div
          // className={clsx(propClasses.localVideo, propClasses.video)}
        >
          <video
            className={clsx(propClasses.localVideo, propClasses.video)}
            ref={localVideoRef}
            playsInline
            muted
            height='auto'
            width={LOCAL_VIDEO_WIDTH}
            autoPlay
            onCanPlay={() => setVideoLoading(false)}
            onLoadStart={() => setVideoLoading(true)}
            style={{
              display: showBackground ?
                      'block' :
                      'none',
            }}
          />
          <canvas
            className={clsx(propClasses.localVideo, propClasses.video)}
            ref={canvasRef}
            height='auto'
            width='340'
            style={{
              display: !showBackground?
                      'block':
                      'none',
            }}
          />
        </div>
        <div className={propClasses.controls}>
          <WebcamControls />
        </div>
      </Paper>
    </div>
  );
}
/**
 * A memoized version of the LocalVideo component.
 * @type {React.NamedExoticComponent<LocalVideo>}
 */
export const MemoizedLocalVideo = React.memo(LocalVideo);

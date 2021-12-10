/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {CircularProgress, Paper} from '@material-ui/core';
import UserAvatar from '../common/UserAvatar';
import {VideoClasses, VideoProps} from './VideoPlayer';
import clsx from 'clsx';
import User from '../../shared/classes/User';
import {
  EXTERNAL_VIDEO_HEIGHT, EXTERNAL_VIDEO_WIDTH,
} from '../../util/constants';

interface ExternalVideoClasses extends VideoClasses {
    externalContainer?: string;
    externalVideo?: string;
    externalAvatar?: string;
}
export interface ExternalVideoProps extends VideoProps {
    propClasses: ExternalVideoClasses
    stream: MediaStream;
    user: User,
}

/**
 * Renders an external video element which displays incoming video streams
 * from external sources(peers).
 * @param {MediaStream} stream The stream to display.
 * @param {User} user The user associated with the stream.
 * @param {boolean} videoLoading A boolean indicating whether the video is
 * loading or ready to displayed. When loading is true, the webcam preview
 * is hidden and a loading animation is shown.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setVideoLoading
 * A function to set the video loading state.
 * @param {ExternalVideoClasses} propClasses An object representing Css classes
 * to pass to the internal components.
 * @return {JSX.Element}
 * @return {JSX.Element}
 * @constructor
 */
export function ExternalVideo({
  stream,
  user,
  videoLoading,
  setVideoLoading,
  propClasses,
}: ExternalVideoProps) {
  /** Set video loading to true on first render */
  useEffect(() => {
    setVideoLoading(true);
  }, []);

  return (
    <div className={propClasses.container}>
      {videoLoading &&(
        <
          CircularProgress
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
        <UserAvatar className={propClasses.externalAvatar} user={user}/>
        <video
          className={clsx(propClasses.externalVideo, propClasses.video)}
          ref={(video) => {
            if (video && stream) {
              video.srcObject = stream;
            }
          }}
          height={EXTERNAL_VIDEO_HEIGHT}
          width={'auto'}
          playsInline
          autoPlay
          preload={'auto'}
          onCanPlay={ () => setVideoLoading(false)}
        />
      </Paper>
    </div>
  );
}

/**
 * A memoized version of the ExternalVideo component.
 * @type {React.NamedExoticComponent<ExternalVideoProps>}
 */
export const MemoizedExternalVideo = React.memo(ExternalVideo);

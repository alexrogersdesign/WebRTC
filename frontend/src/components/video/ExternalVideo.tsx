/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import UserAvatar from '../common/UserAvatar';
import {useVideoStyles} from './VideoPlayer';
import clsx from 'clsx';
import User from '@webrtc/backend/dist/shared/classes/User';

export interface ExternalVideoProps {
    stream: MediaStream;
    user: User,
    className?: string;
}

/**
 * Renders an external video element which displays incoming video streams
 * from external sources(peers).
 * @param {MediaStream} stream The stream to display.
 * @param {User} user The user associated with the stream.
 * @param {string} className The CSS class name to the root element.
 * @return {JSX.Element}
 * @constructor
 */
export function ExternalVideo({
  stream,
  user,
  className,
}: ExternalVideoProps) {
  /** A boolean indicating if the video is loading and should
   *  not be displayed */
  const [videoLoading, setVideoLoading] = useState(false);

  const videoClasses = useVideoStyles({videoLoading});

  /** Set video loading to true on first render */
  useEffect(() => {
    setVideoLoading(true);
  }, []);

  return (
    <div
      className={
        clsx(className, videoClasses.container,
            videoClasses.externalContainer,
            videoClasses.hideWhenLoading,
        )}
    >
      {videoLoading &&(
        <
          CircularProgress
          className={videoClasses.progress}
          size={80}
          thickness={4}
          disableShrink
          classes={{
            circle: videoClasses.circle,
          }}
        />
      )}
      <div className={videoClasses.externalBorder}>
        <UserAvatar
          className={
            clsx(videoClasses.externalAvatar, videoClasses.hideWhenLoading)
          }
          user={user}
        />
        <video
          className={clsx(
              videoClasses.externalVideo,
              videoClasses.video,
          )}
          ref={(video) => {
            if (video && stream) {
              video.srcObject = stream;
            }
          }}
          playsInline
          autoPlay
          preload={'auto'}
          onPlaying={() => setVideoLoading(false)}
        />
      </div>
    </div>
  );
}

/**
 * A memoized version of the ExternalVideo component.
 * @type {React.NamedExoticComponent<ExternalVideoProps>}
 */
export const MemoizedExternalVideo = React.memo(ExternalVideo);

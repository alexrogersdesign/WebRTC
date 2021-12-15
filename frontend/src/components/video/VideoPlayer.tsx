/* eslint-disable no-unused-vars */
import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import User from '../../shared/classes/User';
import {MemoizedExternalVideo} from './ExternalVideo';
import {MemoizedLocalVideo} from './LocalVideo';

export type VideoSettings = {
  height: number;
  width: number;
}

interface StyleProps {
    videoLoading: boolean;
    hideControls?: boolean;
    videoSettings?: VideoSettings
}

const outerBorderRadius = 10;
const innerPadding = 1;
const innerBorderRadius = outerBorderRadius - innerPadding;
export const useVideoStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      flexWrap: 'nowrap',
    },
    externalContainer: {
      zindex: 0,
    },
    hideWhenLoading: ({videoLoading}) => ({
      // opacity: videoLoading ? 0 : 1,
      visibility: videoLoading ?'hidden' : 'visible',
    }),
    paper: () => ({
      padding: innerPadding,
      borderRadius: outerBorderRadius,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.neutralGray.dark,
      boxShadow: theme.shadows[4],
      width: 'max-content',
      height: 'max-content',
      // overflow: 'hidden',
    }),
    video: {
      borderRadius: innerBorderRadius,
    },
    externalVideo: () => ({
      borderRadius: innerBorderRadius,
      border: `${theme.palette.neutralGray.dark} 2px solid`,
      boxShadow: theme.shadows[4],
      height: '14rem',
      [theme.breakpoints.down('md')]: {
        height: '14rem',
      },
      [theme.breakpoints.down('sm')]: {
        height: '10rem',
      },
      [theme.breakpoints.down('xs')]: {
        height: '8rem',
      },
    }),
    externalAvatar: {
      zIndex: 1,
      position: 'absolute',
      top: '5%',
      left: '5%',
    },
    controls: ({hideControls}) => ({
      display: hideControls ? 'none' : 'absolute',
      zIndex: 99,
      borderRadius: innerBorderRadius,
      marginTop: '-14%',
      width: '100%',
      height: '100%',
    }),
    progress: {
      position: 'absolute',
      top: '40%',
      left: '40%',
      zIndex: 2,
      animationDuration: '750ms',
    },
    circle: {
      strokeLinecap: 'round',
    },
    hide: {
      display: 'none',
    },
  }),
);
 interface PlayerProps {
    className?: string;
 }
 interface ExternalProps {
   local?: false;
   stream: MediaStream;
   user:User
   hideControls?: never;
 }
 interface LocalProps {
   local: true;
   hideControls?: boolean;
   stream?:never;
   user?: never
 }
 type Props = PlayerProps & (ExternalProps | LocalProps);
/**
 * The element that renders video feeds from external or local sources.
 * Returns either a local or external video element depending on the props
 * supplied.
 * @param {false | true | undefined} local An optional boolean indicating
 * whether the video should be rendered as a local video or external video
 * @param {MediaStream | undefined} stream The media stream that is applied
 * to the external video feed.
 * @param {User | undefined} user A user associated with the external video feed
 * @param {string | undefined} className A CSS class name to apply to the
 * root element
 * @param {boolean | undefined} hideControls An optional boolean indicating
 * whether the webcam controls should be hidden on a local video.
 * @return {JSX.Element}
 * @constructor
 */
const VideoPlayer = ({local, stream, user, className, hideControls}: Props)=> {
  return (
    <div >
      { local?
        <MemoizedLocalVideo
          hideControls={hideControls}
        /> :
        <MemoizedExternalVideo
          className={className}
          user={user!}
          stream={stream!}
        />
      }
    </div>
  );
};

export default VideoPlayer;



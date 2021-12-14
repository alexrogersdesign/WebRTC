/* eslint-disable no-unused-vars */
import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import User from '../../shared/classes/User';
import {MemoizedExternalVideo} from './ExternalVideo';
import {MemoizedLocalVideo} from './LocalVideo';

interface StyleProps {
    videoLoading: boolean;
    hideControls?: boolean;
}

const outerBorderRadius = 10;
const innerPadding = 1;
const innerBorderRadius = outerBorderRadius - innerPadding;
export const useVideoStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      flexWrap: 'nowrap',
      [theme.breakpoints.down('xs')]: {
        width: '80%',
      },
    },
    hideWhenLoading: ({videoLoading}) => ({
      opacity: videoLoading? 0: 1,
    }),
    paper: () => ({
      padding: innerPadding,
      borderRadius: outerBorderRadius,
      display: 'flex',
      // flexGrow: -1,
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
    externalVideo: {
      objectFit: 'scale-down',
    },
    externalAvatar: {
      position: 'absolute',
      top: '5%',
      left: '5%',
      zIndex: 98,
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    controls: ({hideControls}) => ({
      display: hideControls? 'none' : 'absolute',
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

const VideoPlayer = ({local, stream, user, className, hideControls}: Props)=> {
  return (
    <div className={className}>
      { local?
        <MemoizedLocalVideo
          hideControls={hideControls}
        /> :
        <MemoizedExternalVideo
          user={user!}
          stream={stream!}
        />
      }
    </div>
  );
};

export default VideoPlayer;



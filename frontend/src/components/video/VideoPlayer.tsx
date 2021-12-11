/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
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
const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      flexWrap: 'nowrap',
      [theme.breakpoints.down('xs')]: {
        width: '80%',
      },
    },
    localContainer: {
      // padding: '5%',
      // width: '30em !important',
    },
    paper: ({videoLoading}) => ({
      padding: innerPadding,
      borderRadius: outerBorderRadius,
      display: 'flex',
      flexGrow: -1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.neutralGray.dark,
      boxShadow: theme.shadows[4],
      opacity: videoLoading? 0: 1,
      width: 'max-content',
      height: 'max-content',
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
      marginTop: '-15%',
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
  const [videoLoading, setVideoLoading] = useState(false);
  const classes = useStyles({videoLoading, hideControls});

  return (
    <div className={className}>
      { local?
        <MemoizedLocalVideo
          propClasses={classes}
          {...{videoLoading, setVideoLoading}}
        /> :
        <MemoizedExternalVideo
          propClasses={classes}
          user={user!}
          stream={stream!}
          {...{videoLoading, setVideoLoading}}
        />
      }
    </div>
  );
};

export default VideoPlayer;

export interface VideoProps {
    videoLoading: boolean;
    setVideoLoading: (value: boolean) => void;
}

export interface VideoClasses {
    container?: string;
    video?: string;
    paper?: string;
    controls?: string;
    progress?: string;
    circle?: string;
}



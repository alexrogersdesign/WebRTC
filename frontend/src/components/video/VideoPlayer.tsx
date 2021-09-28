/* eslint-disable no-unused-vars */
import React, {useContext, useState, useEffect, useMemo} from 'react';
import {Paper} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import User from '../../shared/classes/User';
import {SocketIOContext} from '../../context/SocketIOContext';
import VideoAvatar from './VideoAvatar';
import WebcamControls from './WebcamControls';
import tree from '../../util/img/tree.jpeg';
import {SegmentationContext} from '../../context/SegmentationContext';
type Props = {
  stream?: MediaStream | undefined;
  local?: boolean,
  user?: User
}
// interface VideoDims {
//   videoHeight: number | undefined,
//   videoWidth: number | undefined
// }

const useStyles = makeStyles<Theme, Boolean>((theme: Theme) =>
  createStyles({
    paper: (videoReady) => ({
      padding: 3,
      borderRadius: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.neutralGray.light,
      position: 'relative',
      boxShadow: theme.shadows[2],
      opacity: videoReady? 0: 1,
    }),
    video: {
      width: '100% !important',
      height: 'auto !important',
      borderRadius: 'inherit',
      position: 'relative',
    },
    localVideo: {
      width: '100% !important',
      height: 'auto !important',
      borderRadius: 'inherit',
      position: 'relative',
      transform: 'rotateY(180deg)',
    },
    externalContainer: {
      position: 'relative',
      borderRadius: '10px',
      // flex: '0 2 auto',
      flexWrap: 'nowrap',

      [theme.breakpoints.down('xs')]: {
        // width: '40%',
      },
    },
    externalAvatar: {
      position: 'absolute',
      top: '5%',
      left: '5%',
      zIndex: 98,
    },
    localContainer: {
      // flexWrap: 'nowrap',
      position: 'relative',
      padding: '5%',
      width: '30em !important',
      // height: 'auto !important',
      borderRadius: '10px',
      // border: '10px solid',

      [theme.breakpoints.down('xs')]: {
        // width: '30%',
      },
    },
    controls: {
      zIndex: 99,
      borderRadius: '10',
      marginTop: '-13%',
      width: '100%',
      height: '100%',
    },
  }),
);

const VideoPlayer = ({local, stream, user}: Props)=> {
  const {localVideoRef} = useContext(SocketIOContext);
  const {
    canvasRef,
    removeBackground,
    segmentationReady,
  } = useContext(SegmentationContext);
  const [videoLoading, setVideoLoading] = useState(true);
  // const videoDims = {
  //   videoHeight: localVideoRef?.current?.height,
  //   videoWidth: localVideoRef?.current?.width,
  // };
  const classes = useStyles(videoLoading);
  const [showBackground, setShowBackground] = useState(true);
  useEffect(() => {
    if (removeBackground && segmentationReady) setShowBackground(false);
    else setShowBackground(true);
  }, [removeBackground, segmentationReady]);

  const renderExternalVideo = useMemo(() => (
    <div className={classes.externalContainer}>
      <Paper className={classes.paper} elevation={3} variant="outlined" >
        <VideoAvatar className={classes.externalAvatar} user={user}/>
        <video
          className={classes.video}
          ref={(video) => {
            if (video && stream) video.srcObject = stream;
          }}
          playsInline
          autoPlay
          preload={'auto'}
          onLoadedData={ () => setVideoLoading(false)}
          // onLoadStart={ ()=> setVideoLoading(true)}
        />
      </Paper>
    </div>
  ), [stream]);
  const renderLocalVideo = useMemo(() => (
    <div className={classes.localContainer}>
      <Paper className={classes.paper} elevation={3} variant="outlined" >
        {/* {videoLoading && <CircularProgress/>} */}
        <video
          className={classes.localVideo}
          ref={localVideoRef}
          playsInline
          muted
          autoPlay
          // preload={'auto'}
          onLoadedData={ () => setVideoLoading(false)}
          onLoadStart={ ()=> setVideoLoading(true)}
          style={{
            display: showBackground?
                'block' :
                'none',
          }}
        />
        <canvas
          className={classes.localVideo}
          ref={canvasRef}
          style={{
            display: !showBackground?
                 'block':
                 'none',
            // backgroundImage: `url(${tree})`,
            // backgroundSize: 'cover',
          }}
        />
        <div className={classes.controls}>
          <WebcamControls />
        </div>
      </Paper>
    </div>
  ), [localVideoRef?.current, showBackground]);

  return (
    <>
      {
        local && renderLocalVideo
      }
      {
        !local && renderExternalVideo
      }
    </>
  );
};

export default VideoPlayer;

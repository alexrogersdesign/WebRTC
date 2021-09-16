/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {Paper} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {User} from '../types';

import {SocketIOContext} from '../context/SocketIOContext';
import VideoAvatar from './VideoAvatar';
import WebcamControls from './WebcamControls';
import tree from '../util/img/tree.jpeg';
type Props = {
  stream?: MediaStream | undefined;
  local?: boolean,
  user?: User
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: 3,
      borderRadius: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.neutralGray.light,
      position: 'relative',
      boxShadow: theme.shadows[2],
    },
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
  const {
    localVideoRef,
    canvasRef,
    removeBackground,
  } = useContext(SocketIOContext);
  const classes = useStyles();
  return (
    <>
      {
        local &&
        <div className={classes.localContainer}>
          <Paper className={classes.paper} elevation={3} variant="outlined" >
            <video
              className={classes.localVideo}
              ref={localVideoRef}
              playsInline
              muted
              autoPlay
              style={{display: removeBackground? 'none': 'block'}}
            />
            <canvas
              className={classes.localVideo}
              ref={canvasRef}
              style={{
                display: !removeBackground? 'none': 'block',
                // backgroundImage: `url(${tree})`,
                // backgroundSize: 'cover',
              }}
            />
            <div className={classes.controls}>
              <WebcamControls />
            </div>
          </Paper>
        </div>
      }
      {
        !local &&
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
            />
          </Paper>
        </div>
      }
    </>
  );
};

export default VideoPlayer;

import React, {useContext} from 'react';
import {Paper} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {User} from '../types';

import {SocketIOContext} from '../context/SocketIOContext';
import VideoAvatar from './VideoAvatar';
import WebcamControls from './WebcamControls';

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
      backgroundColor: theme.palette.secondary.main,
      position: 'relative',
    },
    video: {
      // flex: '0 2 auto',
      width: '100% !important',
      height: 'auto !important',
      borderRadius: 'inherit',
      position: 'relative',
    },
    externalContainer: {
      position: 'relative',
      // display: 'block',
      // width: '75% !important',
      // height: 'auto !important',
      borderRadius: '10px',
      // flex: '0 2 auto',
      flexWrap: 'nowrap',
      // flexDirection: 'column',
      // alignItems: 'center',
      // alignContent: 'center',
      // justifyContent: 'center',
      // padding: '0 2em 2em',
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
      // display: 'block-level',
      // flexBasis: '100%',
      zIndex: 99,
      // height: '500px',
      // bottom: '20px !important',
      // left: '30px',
      borderRadius: '10',
      marginTop: '-13%',
      width: '100%',
      height: '100%',
      // top: 5,
      // right: 20,
      // padding: 20,
      // postion: 'absolute !important',
      // border: '10px solid',

    },
  }),
);


const VideoPlayer = ({local, stream, user}: Props)=> {
  const {localVideoRef} = useContext(SocketIOContext);
  const classes = useStyles();
  return (
    <>
      {
        local &&
        <div className={classes.localContainer}>
          <Paper className={classes.paper} elevation={3} variant="outlined" >
            <video
              className={classes.video}
              ref={localVideoRef}
              playsInline
              muted
              autoPlay
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

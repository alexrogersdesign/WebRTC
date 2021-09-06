import React, {useContext} from 'react';
import {Paper} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {User} from '../types';

import {SocketIOContext} from '../context/SocketIOContext';
import VideoAvatar from './VideoAvatar';

type Props = {
  stream?: MediaStream | undefined;
  local?: boolean,
  user?: User
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
      padding: 3,
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 1 10em',
      backgroundColor: theme.palette.secondary.main,
    },
    div: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

    },
    externalVideo: {
      position: 'relative',
      display: 'block',
      width: '100% !important',
      height: 'auto !important',
    },
    externalContainer: {
      position: 'relative',
      display: 'block',
      width: '100% !important',
      height: 'auto !important',
      borderRadius: '10px',
      flex: '1 0 3em',
      flexWrap: 'nowrap',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      // padding: '0 2em 2em',
      [theme.breakpoints.down('xs')]: {
        width: '250px',
      },
    },
    externalAvatar: {
      position: 'absolute',
      top: '5%',
      left: '5%',
      zIndex: 98,
    },
    localContainer: {
      display: 'flex',
      flex: '1 1 auto`',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'auto',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      padding: '0 2em 2em',
      //
      position: 'relative',
      // display: 'block',
      width: '100% !important',
      height: 'auto !important',
      borderRadius: '10px',
      // flex: '1 0 3em',
      // flexWrap: 'nowrap',
      // flexDirection: 'column',
      // alignItems: 'center',
      // alignContent: 'center',
      // justifyContent: 'center',
      // padding: '0 2em 2em',
      [theme.breakpoints.down('xs')]: {
        width: '250px',
      },
    },
    localVideo: {
      position: 'relative',
      display: 'block',
      width: '100% !important',
      height: 'auto !important',
      // width: '300px',
      // borderRadius: '10px',
      // display: 'flex',
      // flexWrap: 'nowrap',
      // flexDirection: 'column',
      // alignItems: 'center',
      // alignContent: 'center',
      // justifyContent: 'center',
      // transform: `scaleX(-1)`,
      // padding: '0 2em 2em',
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
              className={classes.localVideo}
              ref={localVideoRef}
              playsInline
              muted
              autoPlay
            />
          </Paper>
        </div>
      }
      {
        !local &&
        <div className={classes.externalContainer}>
          <Paper className={classes.paper} elevation={3} variant="outlined" >
            <VideoAvatar className={classes.externalAvatar} user={user}/>
            <video
              className={classes.externalVideo}
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

import React, {useContext} from 'react';
import {Paper} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';


import {SocketIOContext} from '../context/SocketIOContext';


type Props = {
  stream?: MediaStream | undefined;
  local?: boolean
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
    externalVideo: {
      width: 'auto',
      height: 'auto',
    },
    externalContainer: {
      // width: '300px',
      // height: '300px',
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
    localVideo: {
      width: '300px',
      borderRadius: '10px',
      // display: 'flex',
      // flexWrap: 'nowrap',
      // flexDirection: 'column',
      // alignItems: 'center',
      // alignContent: 'center',
      // justifyContent: 'center',
      transform: `scaleX(-1)`,
      // padding: '0 2em 2em',
      [theme.breakpoints.down('xs')]: {
        width: '120px',
      },
    },
  }),
);


const VideoPlayer = ({local, stream}: Props)=> {
  const {localVideoRef} = useContext(SocketIOContext);
  const classes = useStyles();
  return (
    <>
      {
        local &&
        <div>
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
            <video
              // className={classes.externalVideo}
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

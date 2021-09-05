import React, {useContext} from 'react';
import {Grid, Paper} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';


import {SocketIOContext} from '../context/SocketIOContext';


type Props = {
  stream?: MediaStream | undefined;
  local?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      backgroundColor: theme.palette.secondary.main,
    },
    externalVideo: {
      width: '550px',
      borderRadius: '10px',
      display: 'flex',
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
      width: '250px',
      borderRadius: '10px',
      display: 'flex',
      flexWrap: 'nowrap',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      transform: `scaleX(-1)`,
      // padding: '0 2em 2em',
      [theme.breakpoints.down('xs')]: {
        width: '250px',
      },
    },
  }),
);


const VideoPlayer = ({local, stream}: Props)=> {
  const {localVideoRef} = useContext(SocketIOContext);
  const classes = useStyles();
  return (
    <Grid item >
      <Paper className={classes.paper} elevation={3} variant="outlined" >
        {local &&
            <video
              className={classes.localVideo}
              ref={localVideoRef}
              playsInline
              muted
              autoPlay
            />}
        {!local &&
          <video
            className={classes.externalVideo}
            ref={(video) => {
              if (video && stream) video.srcObject = stream;
            }}
            playsInline
            autoPlay
          />
        }
      </Paper>
    </Grid>
  );
};

export default VideoPlayer;

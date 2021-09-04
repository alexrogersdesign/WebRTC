import React, {useContext} from 'react';
import {Grid, Typography, Paper} from '@material-ui/core';
import {createStyles, withStyles, Theme} from '@material-ui/core/styles';

import {SocketIOContext} from '../context/SocketIOContext';


type Props = {
  stream?: MediaStream | undefined;
  local?: boolean
}

const styles = createStyles((theme: Theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));


const VideoPlayer = ({local, stream}: Props)=> {
  const {localVideoRef, meeting} = useContext(SocketIOContext);
  return (
    <Grid item>
      <Paper className='paper'>
        <Typography> Meeting: {meeting && meeting.id}</Typography>
        {local &&
            <video
              ref={localVideoRef}
              playsInline
              muted
              autoPlay
            />}
        {!local &&
          <video
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

export default withStyles(styles)(VideoPlayer);

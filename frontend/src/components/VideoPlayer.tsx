import React, {useContext} from 'react';
import {Grid, Typography, Paper} from '@material-ui/core';
import {createStyles, withStyles, Theme} from '@material-ui/core/styles';

import {SocketIOContext} from '../context/SocketIOContext';


type Props = {
  stream?: MediaStream | undefined;
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


const VideoPlayer = ({stream}: Props)=> {
  const {localVideoRef, meeting} = useContext(SocketIOContext);
  console.log('stream prop', stream);
  const RenderVideo = () => {
    if (stream === null) {
      return <video
        ref={localVideoRef}
        playsInline
        muted
        autoPlay
      />;
    } else {
      return <video
        ref={(video) => {
          if (video && stream) video.srcObject = stream;
        }}
        playsInline
        autoPlay
      />;
    }
  };

  return (
    <Grid>
      <Paper className='paper'>
        <Grid item>
          <Typography> {meeting && meeting.id}</Typography>
          <RenderVideo/>
          <video
            ref={localVideoRef}
            playsInline
            muted
            autoPlay
          />
        </Grid>
      </Paper>
    </Grid>
  );
};

export default withStyles(styles)(VideoPlayer);

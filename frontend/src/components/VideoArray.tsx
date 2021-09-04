import React, {useContext} from 'react';
import {SocketIOContext} from '../context/SocketIOContext';
import {Grid, Typography, Paper} from '@material-ui/core';

// import {IExternalMedia} from '../types';
import VideoPlayer from './VideoPlayer';

interface Props {
}

const VideoArray = (props: Props) => {
  const {externalMedia} = useContext(SocketIOContext);

  const videoList = () => externalMedia?.map(({id, stream}) => {
    return (
      <Grid item key={id}>
        <Typography>User ID: {id}</Typography>
        <VideoPlayer stream={stream}/>;
      </Grid>);
  });
  return (
    <Paper>
      <Grid>
        {videoList()}
      </Grid>
    </Paper>
  );
};

export default VideoArray;

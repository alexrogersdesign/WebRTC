import React, {useContext} from 'react';
import {SocketIOContext} from '../context/SocketIOContext';
import {Grid, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

// import {IExternalMedia} from '../types';
import VideoPlayer from './VideoPlayer';

interface Props {
   classes?: {
      root: string,
      video: string
   }
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      width: '600px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      padding: '0 2em 2em',
      [theme.breakpoints.down('xs')]: {
        width: '250px',
      },
    },
  }),
);


const VideoArray = (props: Props) => {
  const {externalMedia} = useContext(SocketIOContext);
  const classes = useStyles();
  const videoList = () => externalMedia?.map(({id, stream}) => {
    return (
      <Grid item key={id} className={classes.grid}>
        <Typography>User ID: {id}</Typography>
        <VideoPlayer stream={stream} />
      </Grid>);
  });
  return (
    <Grid>
      {videoList()}
    </Grid>
  );
};

export default VideoArray;

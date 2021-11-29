import React, {useContext} from 'react';
import {Grid} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {MediaControlContext} from '../../context/MediaControlContext';
import VideoPlayer from './VideoPlayer';

interface StyleProps {
    localVideoRef: React.RefObject<HTMLVideoElement>,
}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    root: (props) => ({
      display: 'flex',
      flexWrap: 'wrap',
      flexGrow: 1,
      justifyContent: 'space-around',
    }),
    grid: (props) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      alignContent: 'center',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        paddingLeft: theme.spacing(9) + 12,
      },
    }),
  }),
);

/**
 * Renders the incoming video streams in an adaptive grid.
 * @return {JSX.Element}
 * @constructor
 */
const VideoGrid = () => {
  const {externalMedia, localVideoRef} = useContext(MediaControlContext);
  const classes = useStyles({localVideoRef});
  const videoList = () => externalMedia?.map(({user, stream}) => {
    return (
      <Grid item key={user.id.toString()} >
        <VideoPlayer stream={stream} user={user} className={classes.video} />
      </Grid>);
  });
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row-reverse"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        className={classes.grid}
      >
        {videoList()}
      </Grid>
    </div>
  );
};

export default VideoGrid;

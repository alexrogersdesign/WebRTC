import React, {useContext} from 'react';
import {Grid} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {MediaControlContext} from '../../context/MediaControlContext';
import VideoPlayer from './VideoPlayer';


const useStyles = makeStyles<Theme>((theme: Theme) =>
  createStyles({
    root: (props) => ({
      display: 'flex',
      flexWrap: 'wrap',
      flexGrow: 1,
      justifyContent: 'space-around',
    }),
    grid: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      alignContent: 'center',
      paddingLeft: '5%',

      [theme.breakpoints.down('xs')]: {
        width: '100%',
        paddingLeft: theme.spacing(9) + 12,
      },
    },
  }),
);

/**
 * Renders the incoming video streams in an adaptive grid.
 * @return {JSX.Element}
 * @constructor
 */
export function VideoGrid() {
  const {externalMedia} = useContext(MediaControlContext);
  const classes = useStyles();
  const videoList = () => externalMedia?.map(({user, stream}) => {
    return (
      <Grid item key={user.id.toString()} >
        <VideoPlayer stream={stream} user={user} />
      </Grid>);
  });
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row-reverse"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        className={classes.grid}
      >
        {videoList()}
      </Grid>
    </div>
  );
};

export const MemoizedVideoGrid = React.memo(VideoGrid);

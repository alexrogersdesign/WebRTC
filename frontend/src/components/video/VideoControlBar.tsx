/* eslint-disable no-unused-vars */
import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

import WebcamControls from './WebcamControls';

const useStyles = makeStyles<Theme>((theme: Theme) =>
  createStyles({
    appBar: {
      top: 'auto',
      bottom: 0,
      zIndex: theme.zIndex.drawer +1,
    },
  }),
);


/**
 * Renders the WebcamControls element inside of an AppBar
 * at the bottom of the screen.
 * The VideoControlBar is used when the application is viewed with a
 * small screen width
 * @return {JSX.Element}
 */
export function VideoControlBar() {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <WebcamControls isolated/>
    </AppBar>
  );
};


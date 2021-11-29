/* eslint-disable no-unused-vars */
import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

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

type Props = {}

/**
 *
 * @return {JSX.Element}
 * @constructor
 */
export function VideoControlBar({}: Props) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      {/* <Toolbar>*/}
      <WebcamControls isolated/>
      {/* </Toolbar>*/}
    </AppBar>
  );
};


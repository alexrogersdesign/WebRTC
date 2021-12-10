/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import {MediaControlContext} from '../../context/MediaControlContext';
import Button from '@material-ui/core/Button';
import {RestContext} from '../../context/RestContext';
import {AppStateContext} from '../../context/AppStateContext';
import {useDemo} from '../../hooks/useDemo';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'maxWidth': 600,
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
    snackbar: {
      width: '40%',
      zIndex: theme.zIndex.drawer,
    },
  }),
);


/**
 * A component that displays the demo prompt message
 * Demo can be enabled or disabled.
 * @constructor
 */
const DemoPrompt = () => {
  const classes = useStyles();
  const {addExternalMedia, removeMedia} = useContext(MediaControlContext);
  const [startDemo, stopDemo, demoPlaying] = useDemo(
      addExternalMedia,
      removeMedia,
  );
  const {meeting} = useContext(RestContext);
  const {sm} = useContext(AppStateContext);
  const [open, setOpen] = useState(false);
  const handleShowDemo = () => {
    startDemo();
    setOpen(false);
  };
  const handleHideDemo = () => {
    stopDemo();
    setOpen(false);
  };
  /* If meeting exists, show prompt */
  useEffect(() => {
    if (meeting) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [meeting]);


  return (
    <div className={classes.root}>
      <Snackbar
        className={classes.snackbar}
        open={open}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        message={'Would you like to see a demo?'}
        action={
          <>
            <Button color='secondary' onClick={handleShowDemo}>
              Show
            </Button>
            <Button color='secondary' onClick={handleHideDemo}>
              Hide
            </Button>
          </>
        }
        style={sm?
          {
            height: '5%',
            top: '14%',
            left: '30%',
          }:
            {
              height: '5%',
              top: '14%',
              left: '20%',
            }
        }
      />
      <Snackbar
        className={classes.snackbar}
        open={demoPlaying && !!meeting}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        message={'A demo is now playing'}
        action={
          <Button color="secondary" onClick={handleHideDemo}>
            Stop
          </Button>
        }
        style={sm?
            {
              height: '5%',
              top: '10%',
              left: '30%',
            }:
          {
            height: '5%',
            top: '10%',
            left: '20%',
          }
        }
      />
    </div>
  );
};

export default DemoPrompt;

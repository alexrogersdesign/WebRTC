/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import {MediaControlContext} from '../../context/MediaControlContext';
import Button from '@material-ui/core/Button';
import {SocketIOContext} from '../../context/SocketIOContext';
import {RestContext} from '../../context/rest/RestContext';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'maxWidth': 600,
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
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
  const {showDemo, setShowDemo} = useContext(MediaControlContext);
  const {meeting} = useContext(RestContext);
  const [open, setOpen] = useState(false);
  const handleShowDemo = () => {
    setShowDemo(true);
    setOpen(false);
  };
  const handleHideDemo = () => {
    setShowDemo(false);
    setOpen(false);
  };
  /* If meeting exists, show prompt */
  useEffect(() => {
    if (meeting) {
      setOpen(true);
    }
  }, [meeting]);


  return (
    <div className={classes.root}>
      <Snackbar
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
        style={
          {
            height: '5%',
            top: '25%',
          }
        }
      />
      <Snackbar
        open={showDemo && !!meeting}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        message={'A demo is now playing'}
        action={
          <Button color="secondary" onClick={handleHideDemo}>
            Stop
          </Button>
        }

      />
    </div>
  );
};

export default DemoPrompt;

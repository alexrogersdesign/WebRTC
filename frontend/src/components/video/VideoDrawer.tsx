/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import clsx from 'clsx';
import {makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import FeaturedVideoIcon from '@material-ui/icons/FeaturedVideo';

import VideoPlayer from './VideoPlayer';
import {MediaControlContext} from '../../context/MediaControlContext';
import {AppStateContext} from '../../context/AppStateContext';
import {MemoizedHelpWrapper} from '../tutorial/HelpWrapper';
import Fade from '@material-ui/core/Fade';
import {ButtonBase} from '@material-ui/core';


type StyleRef = React.RefObject<HTMLVideoElement>
const offset = 20;

const useStyles = makeStyles<Theme, StyleRef>((theme: Theme) => {
  return createStyles({
    root: () => ({
      position: 'fixed',
      right: 20,
      bottom: 20,
    }),
    drawerButton: {
      float: 'right',
      position: 'relative',
      bottom: offset + 30,
      zIndex: theme.zIndex.drawer + 1,
      margin: theme.spacing(1),
      transition: theme.transitions.create(['margin', 'height'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      // border: '1px solid red',
    },
    drawerButtonOpen: {
      display: 'none',
      transition: theme.transitions.create(['margin', 'height'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    openIcon: {
      transform: 'rotateY(180deg) rotateX(180deg)',
      height: '50%',
      zIndex: theme.zIndex.drawer - 500,
    },
    closeIcon: {
      'transform': 'scaleX(2.4) scaleY(1.2)',
      '&:hover, &$focusVisible': {
        'color': theme.palette.grey['100'],
      },
    },
    closeButton: {
      'color': theme.palette.grey['400'],
    },
    drawer: {
      'flexShrink': 0,
    },
    drawerPaper: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '2vh',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      padding: 10,
      bottom: offset + 10,
      backgroundColor: 'rgba(255,255,255,0)',
      outline: 0,
      borderWidth: 0,
    },
    drawerHeader: (props) => ({
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translate(-50%, 0)',
    }),
    drawerContainer: {
      position: 'relative',
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    hide: {
      visibility: 'hidden',
    },
  });
},
);
/**
 * Renders the webcam component drawer which is a collapsable component
 * that displays a preview of the users outgoing webcam feed.
 * @return {JSX.Element}
 */
const VideoDrawer = () => {
  const {localVideoRef} = useContext(MediaControlContext);
  const {videoDrawerOpen, setVideoDrawerOpen} = useContext(AppStateContext);
  const classes = useStyles(localVideoRef);

  const handleDrawerOpen = () => setVideoDrawerOpen(true);
  const handleDrawerClose = () => setVideoDrawerOpen(false);

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.drawerButton, {
          [classes.drawerButtonOpen]: videoDrawerOpen,
        })}
      >
        <MemoizedHelpWrapper
          message={'Open webcam preview'}
          tooltipProps={{placement: 'top-end'}}
        >
          <div>
            <Tooltip
              title="Open webcam preview"
              placement="right"
            >
              <IconButton
                edge='end'
                id={'toggle-preview'}
                aria-label="open webcam preview"
                className={classes.openIcon}
                onClick={handleDrawerOpen}
                size='medium'
              >
                <FeaturedVideoIcon fontSize={'large'}/>
              </IconButton>
            </Tooltip>
          </div>
        </MemoizedHelpWrapper>
      </div>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="bottom"
        open={videoDrawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <VideoPlayer local />
          <div className={classes.drawerHeader}>
            <MemoizedHelpWrapper
              message={'Close preview'}
              tooltipProps={{placement: 'top'}}
            >
              <Fade in={videoDrawerOpen}>
                <div>
                  <Tooltip
                    title="Close webcam preview"
                    placement="top"
                    classes={{
                      popper: clsx( {[classes.hide]: !videoDrawerOpen}),
                    }}
                  >
                    <ButtonBase
                      disableTouchRipple
                      id={'close-webcam-button'}
                      className={classes.closeButton}
                      onClick={handleDrawerClose}
                    >
                      <KeyboardArrowDownIcon
                        className={classes.closeIcon}
                      />
                    </ButtonBase>
                  </Tooltip>
                </div>
              </Fade>
            </MemoizedHelpWrapper>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default VideoDrawer;

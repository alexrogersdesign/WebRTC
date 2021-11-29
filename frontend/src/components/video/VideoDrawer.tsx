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


type StyleRef = React.RefObject<HTMLVideoElement>
const offset = 20;

const useStyles = makeStyles<Theme, StyleRef>((theme: Theme) =>
  createStyles({
    root: (props) => ({
      width: '100%',
      height: props.current?.offsetHeight,
    }),
    drawerButton: {
      float: 'left',
      position: 'fixed',
      bottom: offset + 30,
      zIndex: theme.zIndex.drawer + 1,
      margin: theme.spacing(1),
      transition: theme.transitions.create(['margin', 'height'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
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
      bottom: 0,
    },
    closeIcon: {
      backgroundColor: theme.palette.secondary.light,
    },
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {
      bottom: offset + 10,
      backgroundColor: 'rgba(255,255,255,0)',
      outline: 0,
      borderWidth: 0,
    },
    drawerHeader: (props) => ({
      position: 'absolute',
      bottom: props.current?.offsetHeight,
      padding: theme.spacing(0, 2),
    }),

    content: {
      flexGrow: 1,
      padding: theme.spacing(0, 3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    contentOpen: {
      marginBottom: 0,
    },
    videoPlayer: {
      float: 'left',
      alignSelf: 'flex-end',
      overflow: 'hidden',
    },
  }),
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
                edge='start'
                id={'toggle-preview'}
                aria-label="open webcam preview"
                className={classes.openIcon}
                onClick={handleDrawerOpen}
                size='small'
              >
                <FeaturedVideoIcon/>
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
        <div className={classes.drawerHeader}>
          <MemoizedHelpWrapper
            message={'Close preview'}
            tooltipProps={{placement: 'left-end'}}
          >
            <div>
              <Tooltip
                title="Close webcam preview"
                placement="right"
              >
                <IconButton
                  id={'close-webcam-button'}
                  className={classes.closeIcon}
                  onClick={handleDrawerClose}
                  size='small'
                >
                  <KeyboardArrowDownIcon/>
                </IconButton>
              </Tooltip>
            </div>
          </MemoizedHelpWrapper>
        </div>
        <VideoPlayer local className={classes.videoPlayer} />
      </Drawer>
    </div>
  );
};

export default VideoDrawer;

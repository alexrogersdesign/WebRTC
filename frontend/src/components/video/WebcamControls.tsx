/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ToolTip from '@material-ui/core/Tooltip';
import ScreenShareTwoToneIcon from '@material-ui/icons/ScreenShareTwoTone';
import VolumeOffTwoToneIcon from '@material-ui/icons/VolumeOffTwoTone';
import VideocamOffTwoToneIcon from '@material-ui/icons/VideocamOffTwoTone';
import AccountBoxTwoToneIcon from '@material-ui/icons/AccountBoxTwoTone';

import {SegmentationContext} from '../../context/SegmentationContext';
import {MediaControlContext} from '../../context/MediaControlContext';
import clsx from 'clsx';
import {MemoizedHelpWrapper} from '../tutorial/HelpWrapper';

interface Props {
   className?: string;
   isolated?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: 'auto',
      zIndex: 99,
      backgroundColor: 'rgb(255,255,255, 0)',
    },
    rootAttached: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      backgroundColor: 'rgb(255,255,255, .4)',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
      // color: '#e0e0e0',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),

    },
    divider: {
      height: 28,
      margin: 4,
      color: theme.palette.neutral.light,
      fill: theme.palette.neutral.light,
      backgroundColor: theme.palette.neutral.main,
      opacity: .5,
      width: 1,
    },
  }),
);
/**
 * Renders the webcam controls panel with a help prompt.
 * @param {string | undefined} className The Css classname to be assigned to
 * the root element below the help display.
 * @param {boolean | undefined} isolated A boolean value indicating whether the
 * controls are displayed isolated of a VideoPlayer component. If isolated,
 * the styling is changed to display the controls on the bottom of the screen.
 * Defaults to false.
 * @return {JSX.Element}
 */
const WebcamControls = ({className, isolated}: Props) => {
  const classes = useStyles();
  const {
    setMicMuted,
    setVideoDisabled,
    setScreenSharing,
    micMuted,
    videoDisabled,
    screenSharing,
  } = useContext(MediaControlContext);

  const {
    setRemoveBackground,
    removeBackground,
  } = useContext(SegmentationContext);


  const toggleMuteMicrophone = () => {
    setMicMuted(!micMuted);
  };
  const toggleDisableVideo = () => {
    setVideoDisabled(!videoDisabled);
  };
  const toggleShareScreen = () => {
    setScreenSharing(!screenSharing);
  };
  const toggleRemoveBackground = () => {
    setRemoveBackground(!removeBackground);
  };

  const rootClass = clsx(!isolated && classes.rootAttached, classes.root);
  const theme = useTheme();
  return (
    <MemoizedHelpWrapper
      message={'Webcam controls, hover over buttons for more information'}
      tooltipProps={{placement: 'top'}}
    >
      <div className={className}>
        <Paper className={rootClass} elevation={3}>
          <ToolTip title="Mute Microphone">
            <IconButton
              style={
                {color: micMuted? theme.palette.disabled.main :
                theme.palette.neutral.light,
                }}
              className={classes.iconButton}
              aria-label="mute microphone"
              onClick={toggleMuteMicrophone}
            >
              <VolumeOffTwoToneIcon/>
            </IconButton>
          </ToolTip>
          <Divider className={classes.divider} orientation="vertical" />
          <ToolTip title="Disable Video">
            <IconButton
              style={
                {color: videoDisabled? theme.palette.disabled.main :
                theme.palette.neutral.light}
              }
              className={classes.iconButton}
              aria-label="disable video"
              onClick={toggleDisableVideo}
            >
              <VideocamOffTwoToneIcon/>
            </IconButton>
          </ToolTip>
          <Divider className={classes.divider} orientation="vertical" />
          <ToolTip title="Share Screen">
            <IconButton
              style={
                {color: screenSharing? theme.palette.success.main :
                theme.palette.neutral.light,
                }}
              color="primary"
              className={classes.iconButton}
              aria-label="share screen"
              onClick={toggleShareScreen}
            >
              <ScreenShareTwoToneIcon/>
            </IconButton>
          </ToolTip>
          <Divider className={classes.divider} orientation="vertical" />
          <ToolTip title="Hide Background">
            <IconButton
              style={
                {color: removeBackground? theme.palette.success.light :
                theme.palette.neutral.main,
                }}
              className={classes.iconButton}
              aria-label="hide background"
              onClick={toggleRemoveBackground}
            >
              <AccountBoxTwoToneIcon/>
            </IconButton>
          </ToolTip>
          {/* <Divider className={classes.divider} orientation="vertical" /> */}
        </Paper>
      </div>
    </MemoizedHelpWrapper>
  );
};

export default WebcamControls;

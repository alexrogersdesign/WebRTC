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
import CircularProgress from '@material-ui/core/CircularProgress';
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
      borderBottomLeftRadius: 9,
      borderBottomRightRadius: 9,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      backgroundColor: 'rgb(255,255,255, .5)',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
      width: 35,
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
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    progress: {
      // color: theme.palette.success.light,
      color: theme.palette.neutralGray.main,
      position: 'absolute',
      // top: -6,
      // left: -6,
      zIndex: 1,
    },
    shrink: {
      transition: theme.transitions.easing.easeIn,
      transform: 'scale(0.75)',
      color: theme.palette.success.main,
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
    attemptScreenShare,
    micMuted,
    videoDisabled,
    screenSharing,
  } = useContext(MediaControlContext);

  const {
    setRemoveBackground,
    removeBackground,
    segmentation,
  } = useContext(SegmentationContext);

  const rootClass = clsx(!isolated && classes.rootAttached, classes.root);
  const {palette} = useTheme();
  const effectEngagedColor = palette.success.light;
  const actionDisabledColor = palette.action.disabled;
  const disableEngagedColor= palette.disabled.main;
  const effectDisengagedColor = screenSharing?
       palette.neutral.contrastText:
       palette.neutral.light;
  const hideBackgroundStyle = () : React.CSSProperties => {
    let color = segmentation.ready && removeBackground?
      effectEngagedColor:
      effectDisengagedColor;
    if (videoDisabled) color = actionDisabledColor;
    return {color};
  };

  return (
    <MemoizedHelpWrapper
      message={'Webcam controls, hover over buttons for more information'}
      tooltipProps={{placement: 'top'}}
    >
      <div className={className}>
        <Paper className={rootClass} elevation={3}>
          <ToolTip title="Mute Microphone">
            <IconButton
              style={{
                color: micMuted? disableEngagedColor:effectDisengagedColor,
              }}
              className={classes.iconButton}
              aria-label="mute microphone"
              onClick={() => setMicMuted(!micMuted)}
            >
              <VolumeOffTwoToneIcon/>
            </IconButton>
          </ToolTip>
          <Divider className={classes.divider} orientation="vertical" />
          <ToolTip title="Disable Video">
            <IconButton
              style={{
                color: videoDisabled? disableEngagedColor:effectDisengagedColor,
              }}
              className={classes.iconButton}
              aria-label="disable video"
              onClick={()=> setVideoDisabled(!videoDisabled)}
            >
              <VideocamOffTwoToneIcon/>
            </IconButton>
          </ToolTip>
          <Divider className={classes.divider} orientation="vertical" />
          <ToolTip title="Share Screen">
            <IconButton
              style={{
                color: screenSharing? effectEngagedColor: effectDisengagedColor,
              }}
              className={classes.iconButton}
              aria-label="share screen"
              onClick={attemptScreenShare}
            >
              <ScreenShareTwoToneIcon/>
            </IconButton>
          </ToolTip>
          <Divider className={classes.divider} orientation="vertical" />
          <ToolTip title="Hide Background">
            <span>
              <IconButton
                style={hideBackgroundStyle()}
                className={classes.iconButton}
                // className={
                //  clsx(
                //      // !isolated && classes.shrink,
                //      classes.iconButton,
                //  )}
                aria-label="hide background"
                onClick={()=>setRemoveBackground(!removeBackground)}
                disabled={videoDisabled}
              >
                <AccountBoxTwoToneIcon
                  fontSize={segmentation.starting? 'small': 'medium'}
                  className={clsx(segmentation.starting && classes.shrink)}
                />
                {segmentation.starting &&
                  <CircularProgress size={30} className={classes.progress} />
                }
              </IconButton>
            </span>
          </ToolTip>
        </Paper>
      </div>
    </MemoizedHelpWrapper>
  );
};

export default WebcamControls;

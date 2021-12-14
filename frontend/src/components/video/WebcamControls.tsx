/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import ToolTip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScreenShareTwoToneIcon from '@material-ui/icons/ScreenShareTwoTone';
import VolumeOffTwoToneIcon from '@material-ui/icons/VolumeOffTwoTone';
import VideocamOffTwoToneIcon from '@material-ui/icons/VideocamOffTwoTone';
import clsx from 'clsx';
import AccountBoxTwoToneIcon from '@material-ui/icons/AccountBoxTwoTone';

import {SegmentationContext} from '../../context/SegmentationContext';
import {MediaControlContext} from '../../context/MediaControlContext';
import {MemoizedHelpWrapper} from '../tutorial/HelpWrapper';
import {ButtonBase} from '@material-ui/core';

interface Props {
   className?: string;
   isolated?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 45,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      backgroundColor: 'rgb(255,255,255, 0)',
    },
    rootAttached: {
      borderBottomLeftRadius: 9,
      borderBottomRightRadius: 9,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      backgroundColor: 'rgb(255,255,255, .5)',
    },
    iconButtonWrapped: {
      margin: 0,
      padding: theme.spacing(2, 0),
      width: '100%',
    },
    span: {
      width: '25%',
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 'auto',
    },
    iconButton: {
      width: '25%',
      margin: 0,
      padding: theme.spacing(2, 0),
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 'auto',
    },
    divider: {
      height: '70%',
      color: theme.palette.neutral.light,
      fill: theme.palette.neutral.light,
      backgroundColor: theme.palette.neutral.main,
      opacity: .5,
      [theme.breakpoints.down('xs')]: {
        width: 2,
      },
    },
    progress: {
      color: theme.palette.success.light,
      position: 'absolute',
      zIndex: 1,
    },
    loading: {
      // transition: theme.transitions.easing.easeIn,
      flexShrink: 1,
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.sharp,
        // duration: theme.transitions.duration.complex,
        duration: 4000,
      }),
      transform: 'scale(0.75)',
      color: theme.palette.success.main,
    },
    active: {
      'color': theme.palette.success.dark,
      '&:hover, &.Mui-focusVisible': {
        'color': theme.palette.success.light,
      },
    },
    activeMute: {
      'color': theme.palette.disabled.main,
      '&:hover, &.Mui-focusVisible': {
        'color': theme.palette.disabled.light,
      },
    },
    disabled: {
      color: theme.palette.action.disabled,
    },
    inactive: {
      'color': theme.palette.grey['200'],
      '&:hover, &.Mui-focusVisible': {
        'color': theme.palette.grey['300'],
      },
    },
    inactiveAlt: {
      'color': theme.palette.neutral.contrastText,
      '&:hover, &.Mui-focusVisible': {
        'color': theme.palette.grey['200'],
      },
    },
    hide: {
      display: 'none',
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
    toggleScreenShare,
    micMuted,
    videoDisabled,
    screenSharing,
  } = useContext(MediaControlContext);
  const {
    setRemoveBackground,
    removeBackground,
    segmentation,
  } = useContext(SegmentationContext);
  /** A boolean value representing whether the hide background button
   * is disabled.*/
  const hideBackgroundDisabled = videoDisabled || screenSharing;
  /** A boolean value representing whether the share screen button
   * is disabled.*/
  const shareScreenDisabled = segmentation.loading || videoDisabled;
  /** A boolean value representing whether the segmentation button
   * is shown as active.*/
  const segmentationActive = segmentation.ready && removeBackground;
  /** A boolean value representing whether the disable video button
   * is disabled.*/
  const disableVideoDisabled = segmentation.loading;

  return (
    <MemoizedHelpWrapper
      message={'Webcam controls, hover over buttons for more information'}
      tooltipProps={{placement: 'top'}}
    >
      <div className={className}>
        <Paper
          className={clsx( classes.root, {
            [classes.rootAttached]: !isolated,
          })}
          elevation={3}
        >
          <ToolTip
            title={
              !micMuted?
                'Mute Microphone' :
                'Unmute Microphone'
            }
          >
            <ButtonBase
              className={clsx(classes.iconButton, {
                [classes.activeMute]: micMuted,
                [classes.inactive]: !micMuted,
              })}
              aria-label="mute microphone"
              onClick={() => setMicMuted(!micMuted)}
            >
              <VolumeOffTwoToneIcon />
            </ButtonBase>
          </ToolTip>
          <Divider className={classes.divider} orientation="vertical" />
          <ToolTip
            title={!videoDisabled? 'Disable Video' : 'Show Video'}
            classes={{
              popper: clsx( {[classes.hide]: disableVideoDisabled}),
            }}
          >
            <span className={classes.span}>
              <ButtonBase
                aria-label="disable video"
                onClick={()=> setVideoDisabled(!videoDisabled)}
                disabled={disableVideoDisabled}
                className={clsx(classes.iconButtonWrapped, {
                  [classes.activeMute]: videoDisabled && !disableVideoDisabled,
                  [classes.inactive]: !videoDisabled && !disableVideoDisabled,
                  [classes.disabled]: disableVideoDisabled,
                })}
              >
                <VideocamOffTwoToneIcon/>
              </ButtonBase>
            </span>
          </ToolTip>
          <Divider className={classes.divider} orientation="vertical" />
          <ToolTip
            title={!screenSharing? 'Share Screen': 'Stop Sharing Screen '}
            classes={{
              popper: clsx( {[classes.hide]: shareScreenDisabled}),
            }}
          >
            <span className={classes.span}>
              <ButtonBase
                aria-label="share screen"
                onClick={toggleScreenShare}
                disabled={shareScreenDisabled}
                className={clsx(classes.iconButtonWrapped, {
                  [classes.inactive]: !screenSharing && !shareScreenDisabled,
                  [classes.active]: screenSharing && !shareScreenDisabled,
                  [classes.disabled]: shareScreenDisabled,
                })}
              >
                <ScreenShareTwoToneIcon />
              </ButtonBase>
            </span>
          </ToolTip>
          <Divider className={classes.divider} orientation="vertical" />
          <ToolTip
            title={
              !segmentationActive?
              'Hide Background' :
              'Show Background'
            }
            classes={{
              popper: clsx( {[classes.hide]: hideBackgroundDisabled}),
            }}
          >
            <span className={classes.span}>
              <ButtonBase
                className={clsx( classes.iconButtonWrapped, {
                  [classes.active]: segmentationActive &&
                   !hideBackgroundDisabled,
                  [classes.inactive]: !segmentationActive&&
                   !hideBackgroundDisabled,
                  [classes.loading]: segmentation.loading &&
                   screenSharing,
                  [classes.disabled]: hideBackgroundDisabled,
                })}
                aria-label="hide background"
                onClick={()=>setRemoveBackground(!removeBackground)}
                disabled={hideBackgroundDisabled}
              >
                <AccountBoxTwoToneIcon
                  fontSize={segmentation.loading? 'small': 'medium'}
                />
                {segmentation.loading &&
                  <CircularProgress size={30} className={classes.progress} />
                }
              </ButtonBase>
            </span>
          </ToolTip>
        </Paper>
      </div>
    </MemoizedHelpWrapper>
  );
};

export default WebcamControls;

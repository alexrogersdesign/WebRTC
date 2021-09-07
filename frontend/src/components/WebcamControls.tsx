/* eslint-disable no-unused-vars */
import React, {useState, useContext, useEffect} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ToolTip from '@material-ui/core/Tooltip';
import ScreenShareTwoToneIcon from '@material-ui/icons/ScreenShareTwoTone';
// eslint-disable-next-line max-len
import StopScreenShareTwoToneIcon from '@material-ui/icons/StopScreenShareTwoTone';
import VolumeOffTwoToneIcon from '@material-ui/icons/VolumeOffTwoTone';
import VolumeUpTwoToneIcon from '@material-ui/icons/VolumeUpTwoTone';
import VideocamTwoToneIcon from '@material-ui/icons/VideocamTwoTone';
import VideocamOffTwoToneIcon from '@material-ui/icons/VideocamOffTwoTone';
import AccountBoxTwoToneIcon from '@material-ui/icons/AccountBoxTwoTone';

import {SocketIOContext} from '../context/SocketIOContext';
import theme from '../theme';

interface Props {
   onClick?: (event:any) => void,
   field?: string,
   setField?: React.Dispatch<React.SetStateAction<string>>,
   className?: string | undefined
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
const WebcamControls = ({className}: Props) => {
  const classes = useStyles();
  const {
    setMicMuted,
    setVideoDisabled,
    setScreenSharing,
    setRemoveBackground,
    micMuted,
    videoDisabled,
    screenSharing,
    removeBackground,
  } = useContext(SocketIOContext);


  const handleMuteMicrophone = (event: any) => {
    setMicMuted && setMicMuted(!micMuted);
  };
  const handleDisableVideo = (event: any) => {
    setVideoDisabled && setVideoDisabled(!videoDisabled);
  };
  const handleShareScreen = (event: any) => {
    setScreenSharing && setScreenSharing(!screenSharing);
  };
  const handleRemoveBackground = (event: any) => {
    setRemoveBackground && setRemoveBackground(!removeBackground);
  };


  return (
    <div className={className}>
      <Paper className={classes.root} elevation={3}>
        <ToolTip title="Mute Microphone">
          <IconButton
            style={
              {color: micMuted? theme.palette.disabled.main :
                theme.palette.neutral.light,
              }}
            className={classes.iconButton}
            aria-label="mute microphone"
            onClick={handleMuteMicrophone}
          >
            <VolumeOffTwoToneIcon/>
          </IconButton>
        </ToolTip>
        <Divider className={classes.divider} orientation="vertical" />
        <ToolTip title="Disable Video">
          <IconButton
            // eslint-disable-next-line max-len
            style={
              {color: videoDisabled? theme.palette.disabled.main :
                theme.palette.neutral.light}
            }
            className={classes.iconButton}
            aria-label="disable video"
            onClick={handleDisableVideo}
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
            onClick={handleShareScreen}
          >
            <ScreenShareTwoToneIcon/>
          </IconButton>
        </ToolTip>
        <Divider className={classes.divider} orientation="vertical" />
        <ToolTip title="Remove Background">
          <IconButton
            style={
              {color: removeBackground? theme.palette.success.light :
                theme.palette.neutral.main,
              }}
            className={classes.iconButton}
            aria-label="remove background"
            onClick={handleRemoveBackground}
          >
            <AccountBoxTwoToneIcon/>
          </IconButton>
        </ToolTip>
        {/* <Divider className={classes.divider} orientation="vertical" /> */}
      </Paper>
    </div>
  );
};

export default WebcamControls;

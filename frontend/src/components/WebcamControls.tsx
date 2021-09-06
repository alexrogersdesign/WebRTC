/* eslint-disable no-unused-vars */
import React, {useState, useContext, useEffect} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ToolTip from '@material-ui/core/Tooltip';
import {CopyToClipboard} from 'react-copy-to-clipboard';


import {SocketIOContext} from '../context/SocketIOContext';

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
      width: 400,
      zIndex: 99,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);
const WebcamControls = ({className}: Props) => {
  const classes = useStyles();
  const {joinMeeting, meeting} = useContext(SocketIOContext);
  const [field, setField] = useState('');
  const [copied, setCopied] = useState(false);


  const handleClick = (event: any) => {
    joinMeeting && field && joinMeeting({id: field});
  };


  // set delay for copied tooltip
  useEffect(() => {
    if (copied) {
      setTimeout(()=> setCopied(false), 2000);
    }
  }, [copied]);
  return (
    <div className={className}>
      <Paper component="form" className={classes.root} elevation={3}>
        <ToolTip
          title='Meeting Copied!'
          disableHoverListener={true}
          disableFocusListener={true}
          disableTouchListener={true}
          open={copied}
        >
          <InputBase
            className={classes.input}
            placeholder="Joing a Meeting"
            inputProps={{
              'aria-label': 'Meeting ID',
              'spellCheck': 'false',
            }}
            value={field}
            onChange={(e) => setField(e.target.value)}
          />
        </ToolTip>
        <Divider className={classes.divider} orientation="vertical" />
        <ToolTip title="Join Meeting">
          <IconButton
            color="primary"
            className={classes.iconButton}
            aria-label="join meeting"
            onClick={handleClick}
          >
            <ExitToAppIcon />
          </IconButton>
        </ToolTip>
      </Paper>
    </div>
  );
};

export default WebcamControls;

/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';


import FileCopyIcon from '@material-ui/icons/FileCopy';
import ToolTip from '@material-ui/core/Tooltip';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Meeting from '../../shared/classes/Meeting';
interface Props {
   meeting:Meeting
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      // alignItems: 'flex-start',
    },
    secondary: {
      // padding: theme.spacing(0, 70, 0),
      alignSelf: 'flex-start',
    },
  }),
);

const MeetingListDisplay = ({meeting}: Props) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(()=> setCopied(false), 2000);
    }
  }, [copied]);

  const meetingPrimary = `${meeting?.title}`;
  const meetingSecondary = `ID: ${meeting?.id}`;
  return (
    <ListItem
      alignItems='flex-start'
      className={classes.listItem}
      button
      style={{backgroundColor: 'transparent', cursor: 'default'}}
      disableRipple={true}
    >
      <CopyToClipboard
        text={meeting.id.toString()}
        onCopy={()=> setCopied(true)}
      >
        <ToolTip title='Copy Current Meeting ID' placement="top">
          <ListItemIcon>
            <IconButton
            //   className={classes.iconButton}
              edge='start'
              aria-label='copy to clipboard'>
              <ConfirmationNumberIcon />
            </IconButton>
          </ListItemIcon>
        </ToolTip>
      </CopyToClipboard>
      <ListItemText primary={meetingPrimary} secondary={meetingSecondary} />
      <ListItemSecondaryAction className={classes.secondary}>
        <CopyToClipboard
          text={meeting.id.toString()}
          onCopy={()=> setCopied(true)}
        >
          <ToolTip title="Copy Current Meeting ID">
            <IconButton
            //   className={classes.iconButton}
              edge='start'
              aria-label="copy to clipboard">
              <FileCopyIcon />
            </IconButton>
          </ToolTip>
        </CopyToClipboard>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default MeetingListDisplay;

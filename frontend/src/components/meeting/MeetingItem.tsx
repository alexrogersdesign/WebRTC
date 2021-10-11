/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import ToolTip from '@material-ui/core/Tooltip';
import Meeting from '../../shared/classes/Meeting';
import AlertDialog from './AlertDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {RestContext} from '../../context/rest/RestContext';
import {SocketIOContext} from '../../context/SocketIOContext';

interface Props {
  meeting: Meeting
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      // width: '100%',
      flexShrink: 1,
      // alignItems: 'flex-start',
    },
    secondary: {
      // padding: theme.spacing(0, 70, 0),
      // alignSelf: 'flex-start',
    },
    delete: {
      // padding: theme.spacing(0, 70, 0),
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
  }),
);

const MeetingItem = ({meeting}: Props) => {
  const classes = useStyles();
  const {deleteMeeting} = useContext(RestContext);
  const {joinMeeting} = useContext(SocketIOContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const handleDelete = () => {
    deleteMeeting(meeting.id.toString());
  };
  const meetingPrimary = `${meeting?.title}`;
  const meetingSecondary = `ID: ${meeting?.id}`;
  return (
    <>
      <ListItem
        alignItems='flex-start'
        onClick={()=>joinMeeting(meeting.id.toString())}
        className={classes.listItem}
        button
        // style={{backgroundColor: 'transparent', cursor: 'default'}}
        disableRipple={true}
      >
        <ListItemText primary={meetingPrimary} secondary={meetingSecondary} />
        <ListItemSecondaryAction>
          <ToolTip title="Delete Meeting">
            <IconButton
              className={classes.delete}
              onClick={() => setAlertOpen(true)}
              edge='end'
              aria-label="Delete Meeting">
              <DeleteIcon />
            </IconButton>
          </ToolTip>
        </ListItemSecondaryAction>
      </ListItem>
      <AlertDialog
        open={alertOpen}
        setOpen={setAlertOpen}
        title={'Delete Meeting?'}
        dialog={'Are you sure you want to Delete?'}
        action={handleDelete}
        confirmLabel={'Delete'}
        cancelLabel={'Cancel'}
        warn
      />
    </>

  );
};

export default MeetingItem;

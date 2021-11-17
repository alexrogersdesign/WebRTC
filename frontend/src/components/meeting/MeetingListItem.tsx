import React, {useState, useContext} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import ToolTip from '@material-ui/core/Tooltip';
import Meeting from '../../shared/classes/Meeting';
import AlertDialog from '../common/AlertDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {RestContext} from '../../context/rest/RestContext';
import {SocketIOContext} from '../../context/SocketIOContext';
import MeetingCardModal from './MeetingCardModal';
import {toLocalStringMonth} from '../../util/timeHelper';

interface Props {
  meeting: Meeting
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      flexShrink: 1,
    },
    delete: {
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
  }),
);

const MeetingListItem = ({meeting}: Props) => {
  const classes = useStyles();
  const {deleteMeeting} = useContext(RestContext);
  const {joinMeeting} = useContext(SocketIOContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const handleDelete = () => {
    void deleteMeeting(meeting.id.toString());
  };
  const handleJoin = () => {
    joinMeeting(meeting.id.toString());
  };
  const meetingPrimary = `${meeting?.title}`;
  const meetingSecondary = toLocalStringMonth(meeting?.start);
  return (
    <>
      <ListItem
        alignItems='flex-start'
        onClick={()=>setJoinModalOpen(true)}
        className={classes.listItem}
        button
        disableRipple={true}
      >
        <ListItemText
          primary={meetingPrimary}
          primaryTypographyProps={{id: 'meeting-title'}}
          secondary={meetingSecondary}
          secondaryTypographyProps={{id: 'meeting-start'}}
        />
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
      <MeetingCardModal
        open={joinModalOpen}
        setOpen={setJoinModalOpen}
        meeting={meeting}
        action={handleJoin}
      />
    </>
  );
};

export default MeetingListItem;

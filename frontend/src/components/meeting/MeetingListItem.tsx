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
import MeetingCardModal from './MeetingCardModal';
import {toLocalStringMonth} from '../../util/timeHelper';
import Avatar from '@material-ui/core/Avatar';

interface Props {
  meeting: Meeting
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 1,
    },
    delete: {
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 5,
    },
    itemText: {
      padding: theme.spacing(0, 1, 0),
    },
    primaryText: {
      marginBottom: -5,
    },
  }),
);

const MeetingListItem = ({meeting}: Props) => {
  const classes = useStyles();
  const {deleteMeeting} = useContext(RestContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const handleDelete = () => {
    void deleteMeeting(meeting.id.toString());
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
        <Avatar
          className={classes.logo}
          variant={'rounded'}
          src={meeting.icon}
        />
        <ListItemText
          className={classes.itemText}
          primary={meetingPrimary}
          primaryTypographyProps={{
            id: 'meeting-title',
            color: 'secondary',
            variant: 'h6',
            className: classes.primaryText,
          }}
          secondary={meetingSecondary}
          secondaryTypographyProps={{
            id: 'meeting-start',
            variant: 'subtitle2',
          }}
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
      />
    </>
  );
};

export default MeetingListItem;

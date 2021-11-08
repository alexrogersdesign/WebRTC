/* eslint-disable no-unused-vars */
/* eslint-disable-next-line new-cap */
// eslint-disable-next-line new-cap
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
import MeetingInfoModal from './MeetingInfoModal';
import {join} from 'lodash';
import MeetingCardModal from './MeetingCardModal';
import ModalWrapper from '../common/ModalWrapper';
import MeetingCard from './MeetingCard';
import PropTypes from 'prop-types';
import JoinMeetingForm from '../forms/JoinMeetingForm';

interface Props {
  meeting: Meeting
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      flexShrink: 1,
    },
    secondary: {
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
    deleteMeeting(meeting.id.toString());
  };
  const handleJoin = () => {
    joinMeeting(meeting.id.toString());
  };
  const meetingPrimary = `${meeting?.title}`;
  const meetingSecondary = `${meeting?.start.toLocaleString([],
      {month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit'})}`;
  return (
    <>
      <ListItem
        alignItems='flex-start'
        onClick={()=>setJoinModalOpen(true)}
        className={classes.listItem}
        button
        // style={{backgroundColor: 'transparent', cursor: 'default'}}
        disableRipple={true}
      >
        <ListItemText
          primary={meetingPrimary}
          primaryTypographyProps={{id: 'meeting-title'}}
          secondary={meetingSecondary}
          secondaryTypographyProps={{id: 'meeting-id'}}
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
      {/* <MeetingInfoModal*/}
      {/*  open={joinModalOpen}*/}
      {/*  setOpen={setJoinModalOpen}*/}
      {/*  meeting={meeting}*/}
      {/*  action={handleJoin}*/}
      {/* />*/}
      <MeetingCardModal
        open={joinModalOpen}
        setOpen={setJoinModalOpen}
        meeting={meeting}
        action={handleJoin}
      />
      {/* <ModalWrapper*/}
      {/*  Component={<MeetingCard meeting={meeting}/>}*/}
      {/*  componentProps={meeting}*/}
      {/*  open={joinModalOpen}*/}
      {/*  setOpen={setJoinModalOpen}*/}
      {/* />*/}
    </>
  );
};

export default MeetingListItem;

import React, {useContext} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CreateIcon from '@material-ui/icons/Create';
import ListItemText from '@material-ui/core/ListItemText';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';


import {RestContext} from '../../context/RestContext';
import LogoutButton from './LogoutButton';


interface Props {
    setCreateMeetingModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setJoinMeetingModal: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * The components to render when no meeting has been joined but a
 * user has logged in.
 * @param { React.Dispatch<React.SetStateAction<boolean>>}
 * setCreateMeetingModalOpen
 * @param { React.Dispatch<React.SetStateAction<boolean>>} setJoinMeetingModal
 * @return {JSX.Element}
 * @function
 */
export default function RenderWhenNoMeeting({
  setCreateMeetingModalOpen,
  setJoinMeetingModal,
}: Props) {
  const joinDialog = 'Join an existing meeting';
  const createDialog = 'Create a new meeting';

  const {currentUser, meeting} = useContext(RestContext);

  if (!meeting && currentUser) {
    return (
      <>
        <ListItem
          button
          onClick={() => setCreateMeetingModalOpen(true)}
          id='create-meeting-button'
          aria-label='create meeting button'
        >
          <ListItemIcon> <CreateIcon /></ListItemIcon>
          <ListItemText primary={createDialog} />
        </ListItem>
        <ListItem
          button
          onClick={() => setJoinMeetingModal(true)}
          id='join-meeting-button'
          aria-label='join meeting button'
        >
          <ListItemIcon> <MeetingRoomIcon /></ListItemIcon>
          <ListItemText primary={joinDialog} />
        </ListItem>
        <LogoutButton/>
      </>
    );
  } else return <></>;
}

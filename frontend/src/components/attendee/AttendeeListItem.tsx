import React, {useState} from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@material-ui/core';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import User from '@webrtc/backend/dist/shared/classes/User';

import UserAvatar from '../common/UserAvatar';
import AttendeeInfo, {AttendeeInfoProps} from './AttendeeInfo';
import ModalWrapper from '../common/ModalWrapper';

interface Props {
   user:User
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
    },
    listItemText: {
      padding: theme.spacing(0, 2),
    },
  }),
);

const AttendeeListItem = ({user}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const labelId = `Attendee-list-secondary-label-${user.id}`;
  const name = `${user.firstName} ${user.lastName}`;
  const classes = useStyles();
  return (
    <>
      <ListItem
        key={user.id.toString()}
        button
        onClick={() => setModalOpen(true)}
      >
        <ListItemAvatar>
          <UserAvatar
            user={user}
            clickDisabled
          />
        </ListItemAvatar>
        <ListItemText
          className={classes.listItemText}
          id={labelId}
          primary={name} />
        <Divider variant='middle' />
      </ListItem>
      <ModalWrapper<AttendeeInfoProps>
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        WrappedComponent={AttendeeInfo}
        componentProps={{
          open: modalOpen,
          setOpen: setModalOpen,
          user,
        }}
      />
    </>
  );
};

export default AttendeeListItem;

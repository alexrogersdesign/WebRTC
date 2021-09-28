import React, {useState} from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@material-ui/core';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import User from '../../shared/classes/User';

import VideoAvatar from '../video/VideoAvatar';
import AttendeeInfoModal from './AttendeeInfoModal';

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
      <ListItem key={user.id} button onClick={() => setModalOpen(true)}>
        <ListItemAvatar>
          <VideoAvatar
            user={user}
            disabled
          />
        </ListItemAvatar>
        <ListItemText
          className={classes.listItemText}
          id={labelId}
          primary={name} />
        <Divider variant='middle' />
      </ListItem>
      <AttendeeInfoModal
        open={modalOpen}
        setOpen={setModalOpen}
        user={user}
      />
    </>
  );
};

export default AttendeeListItem;

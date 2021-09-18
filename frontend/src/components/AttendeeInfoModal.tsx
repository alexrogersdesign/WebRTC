import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';

import {User} from '../types';
import VideoAvatar from './VideoAvatar';
import {IconButton} from '@material-ui/core';

interface Props {
   open: boolean,
   setOpen: React.Dispatch<React.SetStateAction<boolean>>,
   user: User,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      borderRadius: 5,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      zIndex: 99,
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    item: {
      margin: theme.spacing(0, 0, 1),
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    titleItem: {
      padding: theme.spacing(0, 1, 0),
    },
  }),
);

const JoinMeetingModal = ({open, setOpen, user}: Props) => {
  const classes = useStyles();
  const handleClose = () => setOpen(false);


  return (
    <div>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="attendee-modal-title"
        aria-describedby="info-about-attendee"
      >
        <div className={classes.paper}>
          <IconButton
            style={{float: 'right'}}
            onClick={() => setOpen(false)}
          >
            <CloseIcon/>
          </IconButton>
          <div className={classes.title}>
            <VideoAvatar disabled className={classes.titleItem} user={user}/>
            <Typography
              className={classes.titleItem}
              variant='h5'
              id="join-meeting"
            >
              {`${user.firstName} ${user.lastName}`}
            </Typography>
          </div>
          <List>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={'Name'}
                secondary={`${user.firstName} ${user.lastName}`}
              >
              </ListItemText>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={'User ID'}
                secondary={user.id}
              >
              </ListItemText>
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        </div>
      </Modal>
    </div>
  );
};

export default JoinMeetingModal;

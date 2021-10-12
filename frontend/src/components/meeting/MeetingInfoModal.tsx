/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';


import Meeting from '../../shared/classes/Meeting';

import {IconButton} from '@material-ui/core';
import CopyButtonIcon from '../common/CopyButtonIcon';
import Button from '@material-ui/core/Button';

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    meeting: Meeting,
    action: () => void,
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
      flexDirection: 'column',
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
    button: {
      // flexDirection: 'column',
      margin: theme.spacing(1, 0, 0),
      // position: 'absolute',
      // left: '100%',
      float: 'right',
    },
  }),
);

const MeetingInfoModal = ({open, setOpen, meeting, action}: Props) => {
  const classes = useStyles();
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="attendee-modal-title"
        aria-describedby="info-about-meeting"
      >
        <div className={classes.paper}>
          <IconButton
            style={{float: 'right'}}
            onClick={() => setOpen(false)}
          >
            <CloseIcon/>
          </IconButton>
          <div className={classes.title}>
            <Typography
              className={classes.titleItem}
              variant='h5'
              id="meeting-title"
            >
              {`Title: ${meeting.title}`}
            </Typography>
          </div>
          <List>
            <ListItem alignItems="flex-start">
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={'Meeting ID'}
                secondary={meeting.id.toString()}
              >
              </ListItemText>
              <CopyButtonIcon
                textToCopy={meeting.id.toString()}
                description={'Meeting ID'}
                edge='end'
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
          <Button
            className={classes.button}
            onClick={()=> action()}
            variant="contained"
            color="primary"
          >
                Join
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MeetingInfoModal;

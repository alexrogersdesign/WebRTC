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

import {DialogContent, Grid, IconButton} from '@material-ui/core';
import CopyButtonIcon from '../common/CopyButtonIcon';
import Button from '@material-ui/core/Button';
import MeetingCard from './MeetingCard';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';

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
      // width: '80%',
      // height: '30%',
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

const MeetingCardModal = ({open, setOpen, meeting, action}: Props) => {
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
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open} timeout={{enter: 750, exit: 250}}>
          {/* <Grid container spacing={4}>*/}
          {/* <Grid item xs={12} md={8} lg={8}>*/}
          <MeetingCard meeting={meeting}/>
          {/* </Grid>*/}
          {/* </Grid>*/}
        </Fade>
      </Modal>
    </div>
  );
};

export default MeetingCardModal;

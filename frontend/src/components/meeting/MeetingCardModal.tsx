/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';


import Meeting from '../../shared/classes/Meeting';

import MeetingCard from './MeetingCard';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import DialogContent from '@material-ui/core/DialogContent';

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    meeting: Meeting,
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

const MeetingCardModal = ({open, setOpen, meeting}: Props) => {
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
        <>
          <Fade in={open} timeout={{enter: 750, exit: 250}}>
            <MeetingCard meeting={meeting}/>
          </Fade>
        </>
      </Modal>
    </div>
  );
};

export default MeetingCardModal;

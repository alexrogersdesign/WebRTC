import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import MeetingInputField from './meeting/MeetingInputField';

interface Props {
   open: boolean,
   setOpen: React.Dispatch<React.SetStateAction<boolean>>,
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
  }),
);

const JoinMeetingModal = ({open, setOpen}: Props) => {
  const classes = useStyles();
  const handleClose = () => setOpen(false);


  return (
    <div>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <Typography className={classes.item} variant='h5' id="join-meeting">
            Join Meeting
          </Typography>
          <MeetingInputField
            className={classes.item}
            placeholder='Enter Meeting Code'
          />
        </div>
      </Modal>
    </div>
  );
};

export default JoinMeetingModal;

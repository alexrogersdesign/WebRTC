import React, {forwardRef} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


import JoinMeetingInputField from './JoinMeetingInputField';
import PropTypes from 'prop-types';
import {FormProps} from '../../shared/types';


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

const JoinMeetingForm = forwardRef<HTMLDivElement, FormProps>((props, ref) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.paper} ref={ref}>
        <DialogTitle className={classes.item} id="join-meeting">
            Join Meeting
        </DialogTitle>
        <DialogContent>
          <JoinMeetingInputField
            className={classes.item}
            placeholder='Enter Meeting Code'
          />
        </DialogContent>
      </div>
    </div>
  );
});

JoinMeetingForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

JoinMeetingForm.displayName = 'Join Meeting Form';
export default JoinMeetingForm;

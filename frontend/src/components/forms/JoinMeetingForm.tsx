import React, {forwardRef} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

import JoinMeetingInputField from './JoinMeetingInputField';
import {FormProps} from '../../shared/types';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
      padding: theme.spacing(2, 4, 3),
    },
    closeButton: {
      position: 'absolute',
      top: 0,
      left: 0,
      fontSize: 40,
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }),
);
/**
 * A forward reference exotic component that renders a join meeting form.
 * The component is intended to be rendered inside of a Modal.
 * A ref is forwarded through the component from it's props to a
 * div element wrapping DialogTitle and DialogContent. The forward ref allows
 * the form to be rendered in a Modal component transparently without
 * breaking any of the functionality of the Modal or introducing
 * accessibility issues.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setOpen A function
 * that sets the state of a boolean variable representing whether the
 * modal should open.
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<FormProps>
 *     & React.RefAttributes<HTMLDivElement>>}
 */
const JoinMeetingForm = forwardRef<HTMLDivElement, FormProps>((
    {setOpen}, ref) => {
  const classes = useStyles();
  return (
    <div className={classes.paper} ref={ref}>
      <DialogTitle id="join-meeting">
            Join Meeting
      </DialogTitle>
      <DialogContent>
        <IconButton
          size={'medium'}
          className={classes.closeButton}
          color="secondary"
          aria-label="cancel"
          onClick={()=> setOpen(false)}
        >
          <CancelIcon fontSize={'inherit'}/>
        </IconButton>
        <JoinMeetingInputField
          placeholder='Enter Meeting ID'
        />
      </DialogContent>
    </div>
  );
});

JoinMeetingForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

JoinMeetingForm.displayName = 'Join Meeting Form';
export default JoinMeetingForm;

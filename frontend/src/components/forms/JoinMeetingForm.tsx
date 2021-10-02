import React, {forwardRef} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import MeetingInputField from './MeetingInputField';
import PropTypes from 'prop-types';

interface Props {
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

const JoinMeetingForm = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.paper} ref={ref}>
        <Typography className={classes.item} variant='h5' id="join-meeting">
                        Join Meeting
        </Typography>
        <MeetingInputField
          className={classes.item}
          placeholder='Enter Meeting Code'
        />
      </div>
    </div>
  );
});

JoinMeetingForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

JoinMeetingForm.displayName = 'Join Meeting Form';
export default JoinMeetingForm;

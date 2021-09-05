import React, {useState, useContext} from 'react';
import {Button, TextField, Grid} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {SocketIOContext} from '../context/SocketIOContext';

interface Props {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      width: '500px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      padding: '1em',
      margin: '.5em',
      [theme.breakpoints.down('xs')]: {
        width: '250px',
      },
    },
    textField: {
      flex: '2 1 auto',
    },
  }),
);

const MeetingForm = (props: Props) => {
  const [field, setField] = useState('');
  const classes = useStyles();

  const {joinMeeting} = useContext(SocketIOContext);

  const handleClick = (event: any) => {
    joinMeeting && joinMeeting({id: field});
  };
  return (
    <Grid
      className={classes.grid}
      container
      // direction="row"
      // spacing={1}
      // alignItems="center"
    >
      <Grid item xs={12} className={classes.textField}>
        <TextField
          variant="outlined"
          label="Meeting ID"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <Button
          // size="large"
          variant="contained"
          color="primary"
          onClick={handleClick}
        >Join Meeting</Button>
      </Grid>
    </Grid>
  );
};

export default MeetingForm;

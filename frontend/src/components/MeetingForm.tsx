import React, {useState, useContext} from 'react';
import {Button, TextField, Grid} from '@material-ui/core';
import {createStyles, withStyles, Theme} from '@material-ui/core/styles';

import {SocketIOContext} from '../context/SocketIOContext';

interface Props {

}

const styles = createStyles((theme: Theme) => ({
  button: {
    width: '150',
    [theme.breakpoints.down('xs')]: {
      width: '80',
    },
  },
  form: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'row',
    },
  },
}));

const MeetingForm = (props: Props) => {
  const [field, setField] = useState('');

  const {setMeeting} = useContext(SocketIOContext);

  const handleClick = (event: any) => {
    setMeeting && setMeeting({id: field});
  };
  return (
    <Grid className="form" container direction="row">
      <Grid item>
        <TextField
          variant="outlined"
          label="Meeting ID"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
        >Join Meeting</Button>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(MeetingForm);

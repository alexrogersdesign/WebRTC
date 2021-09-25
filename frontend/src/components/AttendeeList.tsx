/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import VideoAvatar from './VideoAvatar';
import User from '../shared/classes/User';


interface Props {
   users: User[]| undefined;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);


export const AttendeeList = ({users}: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={3} >
      <List dense className={classes.root}>
        {users && users.map((user) => {
          const labelId = `checkbox-list-secondary-label-${user.id}`;
          const name = `${user.firstName} ${user.lastName}`;
          return (
            <ListItem key={user.id} button>
              <ListItemAvatar>
                <VideoAvatar
                  user={user}
                />
              </ListItemAvatar>
              <ListItemText
                id={labelId}
                primary={name}
              />
              <ListItemSecondaryAction>

              </ListItemSecondaryAction>
              <Divider variant='middle' />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

/* eslint-disable react/prop-types */
import React, {forwardRef} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';


import User from '../../shared/classes/User';

import UserAvatar from '../common/UserAvatar';
import {IconButton} from '@material-ui/core';
import PropTypes from 'prop-types';

export interface AttendeeInfoProps{
   user: User,
   setOpen: (open: boolean) => void,
   open: boolean,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    modal: {
      display: 'flex',
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
  }),
);

const AttendeeInfo = forwardRef<HTMLDivElement, AttendeeInfoProps>(({
  open,
  setOpen,
  user}: AttendeeInfoProps, ref) => {
  const classes = useStyles();
  return (
    <div className={classes.paper} ref={ref}>
      <IconButton
        style={{float: 'right'}}
        onClick={() => setOpen(false)}
      >
        <CloseIcon/>
      </IconButton>
      <div className={classes.title}>
        <UserAvatar
          clickDisabled
          className={classes.titleItem}
          user={user}
        />
        <Typography
          className={classes.titleItem}
          variant='h5'
          id="join-meeting"
        >
          {`${user.firstName} ${user.lastName}`}
        </Typography>
      </div>
      <List>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={'Name'}
            secondary={user.fullName}
          >
          </ListItemText>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={'Email'}
            secondary={user.email}
          >
          </ListItemText>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={'User ID'}
            secondary={user.id.toString()}
          >
          </ListItemText>
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
    </div>
  );
});

AttendeeInfo.displayName = 'AttendeeInfo';
AttendeeInfo.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default AttendeeInfo;

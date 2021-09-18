import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {deepOrange, deepPurple} from '@material-ui/core/colors';
import {Tooltip, Avatar, Fab} from '@material-ui/core';

import {User} from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'display': 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    fab: {
      margin: 2,
      opacity: .9,
      zindex: 99,
    },
    absolute: {
      position: 'absolute',
      // bottom: theme.spacing(2),
      // right: theme.spacing(3),
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    },
  }),
);


interface Props {
   user?: User,
   className?: string
}

const VideoAvatar = ({user, className}: Props) => {
  const classes = useStyles();
  return (
    <div className={className}>
      <div className={classes.root}>
        {user && (
          <Tooltip
            title={`${user.firstName} ${user.lastName}  ${user?.id}`}
            aria-label='User Avatar'>
            <Fab
              color='secondary'
              size='medium'
              className={classes.fab}
            >
              <Avatar className={classes.purple} >
                {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
              </Avatar>
            </Fab>
          </Tooltip>
        )}
        {!user && (
          <Avatar/>
        )}
      </div>
    </div>
  );
};

export default VideoAvatar;

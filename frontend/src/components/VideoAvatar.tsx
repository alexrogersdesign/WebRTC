import React, {useState} from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {deepOrange, deepPurple} from '@material-ui/core/colors';
import {Tooltip, Avatar, Fab} from '@material-ui/core';

import {User} from '../types';
import AttendeeInfoModal from './AttendeeInfoModal';

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
   className?: string,
   disabled?: boolean,
}

const VideoAvatar = ({user, className, disabled}: Props) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={className}>
      <div className={classes.root}>
        {user && (
          <>
            <Tooltip
              title={`${user.firstName} ${user.lastName}`}
              aria-label='User Avatar'>
              <Fab
                color='secondary'
                size='medium'
                className={classes.fab}
                onClick={() => setModalOpen(true)}
                disabled={disabled}
              >
                <Avatar className={classes.purple} >
                  {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                </Avatar>
              </Fab>
            </Tooltip>
            <AttendeeInfoModal
              open={modalOpen}
              setOpen={setModalOpen}
              user={user}
            />
          </>
        )}
        {!user && (
          <Avatar/>
        )}
      </div>
    </div>
  );
};

export default VideoAvatar;

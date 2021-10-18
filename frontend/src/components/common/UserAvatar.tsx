import React, {useState} from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {deepOrange, deepPurple} from '@material-ui/core/colors';
import {Tooltip, Avatar, Fab} from '@material-ui/core';


import User from '../../shared/classes/User';

// import AttendeeInfoModal from '../attendee/AttendeeInfoModal';
import ModalWrapper from './ModalWrapper';
import AttendeeInfo, {AttendeeInfoProps} from '../attendee/AttendeeInfo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'display': 'flex',
      '& > *': {
        // margin: theme.spacing(1),
      },
    },
    fab: {
      flexShrink: 0,
      // margin: 2,
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
   clickDisabled?: boolean,
   Component?: JSX.Element,
   componentProps?: any
}

const UserAvatar = ({
  user,
  className,
  clickDisabled,
  Component,
  componentProps,
}: Props) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={className}>
      <div className={classes.root}>
        {user && (
          <>
            {!clickDisabled && (
              <Tooltip
                title={user.fullName}
                aria-label='User Avatar'>
                <Fab
                  color='secondary'
                  size='medium'
                  className={classes.fab}
                  onClick={() => setModalOpen(true)}
                  disabled={clickDisabled}
                >
                  <Avatar
                    className={classes.purple}
                    src={user.icon}
                  >
                    {!user.icon && user.initials}
                  </Avatar>
                </Fab>
              </Tooltip>
            )}
            {clickDisabled && (
              <Fab
                color='secondary'
                size='medium'
                className={classes.fab}
                onClick={() => setModalOpen(true)}
                disabled={clickDisabled}
              >
                <Avatar className={classes.purple} >
                  {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                </Avatar>
              </Fab>
            )}
            <ModalWrapper<AttendeeInfoProps>
              open={modalOpen}
              setOpen={setModalOpen}
              Component={AttendeeInfo}
              {...{user}}
            />
            {/* <AttendeeInfoModal*/}
            {/*  open={modalOpen}*/}
            {/*  setOpen={setModalOpen}*/}
            {/*  user={user}*/}
            {/* />*/}
          </>
        )}
        {!user && (
          <Avatar/>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;

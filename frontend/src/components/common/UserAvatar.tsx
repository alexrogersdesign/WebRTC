import React, {useState} from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {deepOrange, deepPurple} from '@material-ui/core/colors';
import {Tooltip, Avatar, Fab} from '@material-ui/core';


import User from '../../shared/classes/User';

// import AttendeeInfoModal from '../attendee/AttendeeInfoModal';
import ModalWrapper from './ModalWrapper';
import AttendeeInfo, {AttendeeInfoProps} from '../attendee/AttendeeInfo';
// TODO cleanup props and styles
interface StyleProps {avatarSize: number}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    root: {
      'display': 'flex',
      '& > *': {
        // margin: theme.spacing(1),
      },
    },
    fab: (props) => ({
      width: theme.spacing(props.avatarSize + .5),
      height: theme.spacing(props.avatarSize + .5),
      flexShrink: 0,
      // margin: 2,
      // opacity: .9,
      zindex: 99,
    }),
    absolute: {
      position: 'absolute',
      // bottom: theme.spacing(2),
      // right: theme.spacing(3),
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    avatar: (props) => ({
      width: theme.spacing(props.avatarSize),
      height: theme.spacing(props.avatarSize),
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    }),
  }),
);


interface Props {
   user?: User,
   className?: string,
   avatarSize?: number,
   clickDisabled?: boolean,
   Component?: JSX.Element,
   componentProps?: any,
}
type AvatarIconProps = {
    user: User,
    className: string,
}

const AvatarIcon = ({user, className} : AvatarIconProps) => {
  return (
    <Avatar
      className={className}
      src={user.icon}
    >
      {!user.icon && user.initials}
    </Avatar>
  );
};

const UserAvatar = ({
  user,
  className,
  avatarSize,
  clickDisabled,
  Component,
  componentProps,
}: Props) => {
  const classes = useStyles({avatarSize: avatarSize?? 5});
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
                  <AvatarIcon user={user} className={classes.avatar}/>
                </Fab>
              </Tooltip>
            )}
            {clickDisabled && (
              <AvatarIcon user={user} className={classes.avatar}/>
            )}
            <ModalWrapper<AttendeeInfoProps>
              open={modalOpen}
              setOpen={setModalOpen}
              PropComponent={AttendeeInfo}
              {...{user}}
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

export default UserAvatar;

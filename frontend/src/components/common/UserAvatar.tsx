/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {Tooltip, Avatar, Fab} from '@material-ui/core';


import User from '../../shared/classes/User';

import ModalWrapper from './ModalWrapper';
import AttendeeInfo, {AttendeeInfoProps} from '../attendee/AttendeeInfo';
interface StyleProps {avatarSize: number, clickDisabled: boolean | undefined}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    root: {
    },
    fab: () => ({
      display: 'block',
      height: 'max-content',
      width: 'max-content',
      flexShrink: 0,
      backgroundColor: theme.palette.grey['800'],
      zindex: theme.zIndex.drawer,
    }),
    avatar: (props) => ({
      margin: theme.spacing(.25),
      display: 'relative',
      width: theme.spacing(props.avatarSize),
      height: theme.spacing(props.avatarSize),
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.getContrastText(theme.palette.secondary.dark),
      border: props.clickDisabled?
        `1px solid ${theme.palette.grey['600']}`:
      undefined,
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
}: Props) => {
  const classes = useStyles({avatarSize: avatarSize?? 5, clickDisabled});
  const [modalOpen, setModalOpen] = useState(false);

  const AvatarWithButton = () => {
    return (
      <Tooltip
        title={user!.fullName}
        aria-label='User Avatar'
      >
        <Fab
          size='medium'
          className={classes.fab}
          onClick={() => setModalOpen(true)}
          disabled={clickDisabled}
        >
          <AvatarIcon user={user!} className={classes.avatar}/>
        </Fab>
      </Tooltip>
    );
  };
  const AvatarNoButton = () => {
    return (
      <AvatarIcon user={user!} className={classes.avatar}/>
    );
  };
  const RenderAvatar = () => {
    return !clickDisabled ? <AvatarWithButton/> : <AvatarNoButton/>;
  };

  return (
    <div className={className}>
      <div className={classes.root}>
        {user ? (
          <>
            <RenderAvatar/>
            <ModalWrapper<AttendeeInfoProps>
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              WrappedComponent={AttendeeInfo}
              componentProps={{
                open: modalOpen,
                setOpen: setModalOpen,
                user,
              }}
            />
          </>
        ) :<Avatar/> }
      </div>
    </div>
  );
};

export default UserAvatar;

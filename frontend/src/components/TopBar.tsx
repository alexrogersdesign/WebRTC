/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {AppBar,
  AppBarProps,
  Typography,
  Toolbar,
  IconButton,
  Tooltip,
}
  from '@material-ui/core';
// import MenuIcon from '@material-ui/icons/Menu';
import CancelIcon from '@material-ui/icons/Cancel';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import {SocketIOContext} from '../context/SocketIOContext';
import {ChildrenProps} from '../shared/types';
import TopDrawer from './TopDrawer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cancelIcon: {
      fill: 'red',
      color: '#f44336',
      // boxShadow: theme.shadows[2],
    },
  }),
);
interface Props extends ChildrenProps{
  className?: string,
  position?: AppBarProps['position'],
}

const TopBar = ({children, className, position}: Props) => {
  const classes = useStyles();

  const {meeting, startNewMeeting, leaveMeeting} = useContext(SocketIOContext);
  return (
    <AppBar className={className} position={position? position: 'static'}>
      <Toolbar>
        {/* <IconButton edge='start' color='inherit' aria-label='menu'> */}
        {/* <MenuIcon /> */}
        {/* </IconButton> */}
        {children}
        { meeting && (
          <div>
            {/* <Typography variant='h6'>
          Meeting ID:
              <Typography variant='button'>   {meeting.id}</Typography>
              <Tooltip title='Leave Meeting'>
                <IconButton
                  className={classes.cancelIcon}
                  edge='end'
                  aria-label='Leave meeting'
                  size='medium'
                  onClick={leaveMeeting}
                >
                  <CancelIcon/>
                </IconButton>
              </Tooltip>
            </Typography> */}
          </div>
        )}
        {/* {!meeting && (
          <div>
            <Typography variant='button' gutterBottom>
            Create a new meeting
            </Typography>
            <Tooltip title='Start New Meeting'>
              <IconButton
                edge='end'
                aria-label='new meeting'
                size='medium'
                color='inherit'
                onClick={startNewMeeting}
              >
                <FiberNewIcon/>
              </IconButton>
            </Tooltip>
          </div>
        )} */}
        <TopDrawer/>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

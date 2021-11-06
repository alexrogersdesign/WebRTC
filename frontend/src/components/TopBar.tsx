/* eslint-disable no-unused-vars */
// TODO fix this mess
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
import {RestContext} from '../context/rest/RestContext';

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

  const {currentUser} = useContext(RestContext);
  return (
    <AppBar className={className} position={position? position: 'static'}>
      <Toolbar>
        <Typography>{currentUser?.fullName}</Typography>
        {children}
        {/* <TopDrawer/>*/}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

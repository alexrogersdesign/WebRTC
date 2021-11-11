/* eslint-disable no-unused-vars */
// TODO fix this mess
import React, {useContext} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import {AppBarProps} from '@material-ui/core';

import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import {ChildrenProps} from '../shared/types';
import {RestContext} from '../context/rest/RestContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cancelIcon: {
      fill: 'red',
      color: '#f44336',
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
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

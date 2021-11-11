import React, {useContext} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import {AppBarProps} from '@material-ui/core';

import {ChildrenProps} from '../shared/types';
import {RestContext} from '../context/rest/RestContext';

interface Props extends ChildrenProps{
  className?: string,
  position?: AppBarProps['position'],
}

const ControlBar = ({children, className, position}: Props) => {
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

export default ControlBar;

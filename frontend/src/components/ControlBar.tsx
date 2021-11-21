import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {AppBarProps} from '@material-ui/core';

import {ChildrenProps} from '../shared/types';

interface Props extends ChildrenProps{
  className?: string,
  position?: AppBarProps['position'],
}

const ControlBar = ({children, className, position}: Props) => {
  return (
    <AppBar className={className} position={position? position: 'static'}>
      <Toolbar>
        {children}
      </Toolbar>
    </AppBar>
  );
};

export default ControlBar;

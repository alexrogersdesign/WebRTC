import React, {useContext} from 'react';
import {AppBar, Typography, Toolbar, IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import {SocketIOContext} from '../context/SocketIOContext';

interface Props {

}

const TopBar = (props: Props) => {
  const {meeting} = useContext(SocketIOContext);
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge='start' color='inherit' aria-label='menu'>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6'>
         Meeting ID  {meeting && meeting.id}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

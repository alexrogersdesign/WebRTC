/* eslint-disable no-unused-vars */
import React, {useContext, useEffect} from 'react';
// import {RouteComponentProps, useHistory} from 'react-router-dom';
import {Grid, Container, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';


import VideoPlayer from './video/VideoPlayer';
import VideoArray from './video/VideoArray';
import {SocketIOContext} from '../context/SocketIOContext';
import {AttendeeDrawer} from './attendee/AttendeeDrawer';
import ChatDrawer from './chat/ChatDrawer';
import {CustomThemeContext} from '../context/CustomThemeProvider';
import MeetingList from './meeting/MeetingList';
import {RestContext} from '../context/rest/RestContext';
import {MediaControlContext} from '../context/MediaControlContext';
interface Props {
  // history: RouteComponentProps['history'];
  // location: RouteComponentProps['location'];
  // match: RouteComponentProps['match'];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'stretch',
      justifyContent: 'center',
      padding: '2%',
    },
    grid: {
      height: '50%',
      flexWrap: 'wrap',
      padding: 20,
      borderWidth: 40,
      [theme.breakpoints.down('xs')]: {
        width: '250px',
      },
    },
    form: {
      padding: 5,
    },
    local: {
      position: 'fixed',
      float: 'right',
      right: 0,
      bottom: 0,
    },
    topBar: {
      // display: 'flex',
      // flexDirection: 'column',
    },
  }),
);

const Room = (props: Props) => {
  const classes = useStyles();
  const {meeting} = useContext(SocketIOContext);
  const {token, currentUser} = useContext(RestContext);
  const {externalMedia, videoReady} = useContext(MediaControlContext);
  const {currentTheme, setTheme} = useContext(CustomThemeContext);
  const {loggedIn} = useContext(RestContext);
  const users = externalMedia?.map(({user, stream}) => user);

  useEffect(() => {
    if (!token) setTheme && setTheme('dark');
    if (token) setTheme && setTheme('normal');
  }, [meeting, token]);

  return (
    <div >
      <div className={classes.topBar}>
        <AttendeeDrawer user={currentUser} users={users} meeting={meeting}/>
        <ChatDrawer meeting={meeting}/>
      </div>
      <Container className={classes.container}>
        {!meeting && loggedIn && <MeetingList/>}
        <div className={classes.grid}>
          <VideoArray />
          <div className={classes.local}>
            {meeting && videoReady && (<VideoPlayer local/>)}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Room;

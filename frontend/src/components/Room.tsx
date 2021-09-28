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
  const {externalMedia, meeting, videoReady} = useContext(SocketIOContext);
  const {currentTheme, setTheme} = useContext(CustomThemeContext);
  const users = externalMedia?.map(({user, stream}) => user);

  useEffect(() => {
    if (!meeting) setTheme && setTheme('dark');
    if (meeting) setTheme && setTheme('normal');
    console.log('Current Theme', currentTheme);
  }, [meeting]);

  return (
    <div >
      {/* <TopBar/> */}
      <div className={classes.topBar}>
        <AttendeeDrawer users={users} meeting={meeting}/>
        <ChatDrawer meeting={meeting}/>
      </div>
      {/* <AttendeeList users={users}/> */}
      <Container className={classes.container}>
        {/* <ChatBox/> */}
        {/* <MeetingForm /> */}
        <div className={classes.grid}>
          <VideoArray />
          <div className={classes.local}>
            {/* <Typography>{currentUserID && currentUserID}</Typography> */}
            {meeting && videoReady && (<VideoPlayer local/>)}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Room;

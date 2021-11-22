/* eslint-disable no-unused-vars */
import React, {useContext, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';


import VideoPlayer from './video/VideoPlayer';
import VideoArray from './video/VideoArray';
import {SocketIOContext} from '../context/SocketIOContext';
import {ControlBar} from './ControlBar';
import ChatDrawer from './chat/ChatDrawer';
import {CustomThemeContext} from '../context/CustomThemeProvider';
import MeetingList from './meeting/MeetingList';
import {RestContext} from '../context/rest/RestContext';
import {MediaControlContext} from '../context/MediaControlContext';
import DemoPrompt from './Tutorial/DemoPrompt';
import {Alert} from '@material-ui/lab';
import TutorialPrompt from './Tutorial/TutorialPrompt';
interface Props {
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
  }),
);

const Room = (props: Props) => {
  const classes = useStyles();
  const {meeting} = useContext(SocketIOContext);
  const {token, currentUser} = useContext(RestContext);
  const {externalMedia, videoReady} = useContext(MediaControlContext);
  const {setTheme} = useContext(CustomThemeContext);
  const {loggedIn} = useContext(RestContext);
  const users = externalMedia?.map(({user, stream}) => user);

  useEffect(() => {
    if (!token) setTheme && setTheme('dark');
    if (token) setTheme && setTheme('normal');
  }, [meeting, token]);

  return (
    <div >
      <div>
        <ControlBar meeting={meeting}/>
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
        <DemoPrompt/>
      </Container>
    </div>
  );
};

export default Room;

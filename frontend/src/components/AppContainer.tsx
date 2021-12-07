/* eslint-disable no-unused-vars */
import React, {useContext, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';

import VideoPlayer from './video/VideoPlayer';
import {ControlBar} from './ControlBar';
import ChatDrawer from './chat/ChatDrawer';
import {CustomThemeContext} from '../context/CustomThemeProvider';
import MeetingList from './meeting/MeetingList';
import {RestContext} from '../context/RestContext';
import DemoPrompt from './tutorial/DemoPrompt';
import {VideoControlBar} from './video/VideoControlBar';
import {AppStateContext} from '../context/AppStateContext';
import VideoDrawer from './video/VideoDrawer';
import VideoGrid from './video/VideoGrid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'hidden',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'stretch',
      justifyContent: 'center',
      padding: '2%',
    },
    grid: {
    },
    form: {
      padding: 5,
    },
    local: {
      position: 'fixed',
      float: 'right',
      right: 0,
      bottom: 0,
      // [theme.breakpoints.down('xs')]: {
      //  flexDirection: 'column',
      //  width: '100%',
      //  zIndex: theme.zIndex.drawer +1,
      //  bottom: 50,
      // },
    },
  }),
);

/**
 * The AppContainer component is where all visible elements of the
 * application are rendered
 * @return {JSX.Element}
 * @constructor
 */
const AppContainer = () => {
  const classes = useStyles();
  const {token, currentUser, meeting} = useContext(RestContext);
  const {setTheme} = useContext(CustomThemeContext);
  const {xs} = useContext(AppStateContext);

  /** Render a different theme on login */
  useEffect(() => {
    if (!token) setTheme('dark');
    if (token) setTheme('normal');
  }, [meeting, token]);

  return (
    <div className={classes.root}>
      <div>
        <ControlBar meeting={meeting}/>
        <ChatDrawer meeting={meeting}/>
      </div>
      <Container className={classes.container}>
        {(!meeting && currentUser) && <MeetingList/>}
        <div className={classes.grid}>
          <VideoGrid />
          <div className={classes.local}>
            {(meeting && !xs) && (<VideoPlayer local/>)}
          </div>
        </div>
        {(meeting && xs) && (
          <>
            <VideoDrawer/>
            <VideoControlBar/>
          </>
        )}
        <DemoPrompt/>
      </Container>
    </div>
  );
};

export default AppContainer;

/* eslint-disable no-unused-vars */
import React, {useContext, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';

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
      height: 'max-content',
    },
    container: {
      // overflowX: 'hidden',
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'stretch',
      justifyContent: 'center',
      padding: '2%',
    },
    form: {
      padding: 5,
    },
    videoPlayer: {
      margin: '3vw',
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

  /**
   * Groups the elements to be rendered when a meeting
   * has been joined.
   * @return {JSX.Element}
   * @constructor
   */
  const RenderWhenMeeting = () => {
    return (
      <>
        <DemoPrompt/>
        <ChatDrawer />
        <VideoGrid />
        <VideoDrawer offset={xs? 30 : undefined}/>
        {xs && <VideoControlBar/>}
      </>
    );
  };

  return (
    <div className={classes.root}>
      <ControlBar meeting={meeting}/>
      <Container className={classes.container}>
        {(!meeting && currentUser) && <MeetingList/>}
        {meeting && <RenderWhenMeeting/>}
      </Container>
    </div>
  );
};

export default AppContainer;

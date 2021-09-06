/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
// import {RouteComponentProps, useHistory} from 'react-router-dom';
import {Grid, Container, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';


import VideoPlayer from './VideoPlayer';
import VideoArray from './VideoArray';
import {SocketIOContext} from '../context/SocketIOContext';
import MeetingForm from '../components/MeetingForm';
import TopBar from './TopBar';
// import WebcamComponent from './WebcamComponent';
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
      padding: 5,
    },
    grid: {
      // width: '600px',
      // display: 'flex',
      // flexDirection: 'column',
      // alignItems: 'center',
      // alignContent: 'center',
      // justifyContent: 'center',
      flexWrap: 'wrap',
      padding: 20,
      // padding: '0 2em 2em',
      [theme.breakpoints.down('xs')]: {
        // width: '250px',
      },
    },
    form: {
      padding: 5,
    },
  }),
);

const Room = (props: Props) => {
  const {
    // initializeConnection,
    // endConnection,
    currentUserID,
  } = useContext(SocketIOContext);
  const classes = useStyles();

  return (
    <div >
      <TopBar/>
      <Container className={classes.container}>
        <MeetingForm />
        <div className={classes.grid}>
          <VideoArray />
          <div>
            <Typography>{currentUserID && currentUserID}</Typography>
            <VideoPlayer local/>
            {/* <WebcamComponent/> */}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Room;

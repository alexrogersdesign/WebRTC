import React, {useContext, useEffect} from 'react';
import {RouteComponentProps, useHistory} from 'react-router-dom';
import {Grid} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';


import VideoPlayer from './VideoPlayer';
import VideoArray from './VideoArray';
import {SocketIOContext} from '../context/SocketIOContext';
import MeetingForm from '../components/MeetingForm';
import TopBar from './TopBar';
// import WebcamComponent from './WebcamComponent';
interface Props {
  history: RouteComponentProps['history'];
  location: RouteComponentProps['location'];
  match: RouteComponentProps['match'];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      // width: '600px',

      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: 20,
      // padding: '0 2em 2em',
      [theme.breakpoints.down('xs')]: {
        width: '250px',
      },
    },
  }),
);

const Room = (props: Props) => {
  const {
    initializeConnection,
    endConnection,
    meeting,
  } = useContext(SocketIOContext);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    initializeConnection && initializeConnection();
    return () => {
      endConnection && endConnection();
    };
  }, []);
  useEffect(() => {
    history.push('/join/'+meeting?.id);
  }, [meeting]);


  return (
    <div>
      <TopBar/>
      <MeetingForm/>
      <Grid container spacing={2} className={classes.grid}>
        <VideoArray />
        <Grid item>
          <VideoPlayer local/>
          {/* <WebcamComponent/> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default Room;

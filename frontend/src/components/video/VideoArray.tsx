/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {SocketIOContext} from '../../context/SocketIOContext';
import {Grid} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

// import {IExternalMedia} from '../types';
import VideoPlayer from './VideoPlayer';

interface Props {
   classes?: {
      root: string,
      video: string
   }
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'flex',
      flexDirection: 'row',
      // padding: '5%',
      // margin: '5%',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      // border: '10px solid',

    },
    item: {
      display: 'flex',
      flex: '-1 2 auto',
      width: '40%',
      margin: '1%',
      // flex: '1 3 50em',
      // flexDirection: 'row',
      // alignItems: 'center',
      // alignContent: 'center',
      // alignSelf: 'auto',
      // justifyContent: 'flex-start',
      // flexWrap: 'wrap',
      // padding: '0 2em 2em',
      [theme.breakpoints.down('xs')]: {
        // width: '250px',
      },
    },
  }),
);


const VideoArray = (props: Props) => {
  const {externalMedia} = useContext(SocketIOContext);
  const classes = useStyles();
  const videoList = () => externalMedia?.map(({user, stream}) => {
    return (
      <div key={user.id.toString()} className={classes.item}>
        <VideoPlayer stream={stream} user={user}/>
      </div>);
  });
  return (
    <div className={classes.grid}>
      {videoList()}
    </div>
  );
};

export default VideoArray;

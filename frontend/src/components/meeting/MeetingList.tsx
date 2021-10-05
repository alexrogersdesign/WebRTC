import List from '@material-ui/core/List';

;/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';

import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {RestContext} from '../../context/rest/RestContext';
import {ListItem, Paper, Typography} from '@material-ui/core';
import MeetingItem from './MeetingItem';
import {SocketIOContext} from '../../context/SocketIOContext';

interface Props {
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      // textAlign: 'center',
      // padding: theme.spacing(1),
      margin: theme.spacing(2, 1, 1),
    },
    paper: {
      width: '75%',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignItems: 'stretch',
      justifyContent: 'center',
      alignContent: 'stretch',
    },
    item: {
      // alignItems: 'flex-start',
      flexShrink: 1,
    },
  }),
);

const MeetingListDisplay = (props:Props) => {
  const classes = useStyles();
  const {meetingList} = useContext(RestContext);
  const {joinMeeting} = useContext(SocketIOContext);
  return (
    <Paper className={classes.paper} elevation={3} >
      <Typography className={classes.title} variant='h4'>
          Meetings
      </Typography>
      <List className={classes.list}>
        {meetingList?.map((meeting) =>
          <ListItem
            button
            key={meeting.id.toString()}
            className={classes.item}
            onClick={()=>joinMeeting && joinMeeting(meeting.id.toString())}
          >
            <MeetingItem meeting={meeting}/>
          </ListItem>,
        )}
      </List>
    </Paper>
  );
};

export default MeetingListDisplay;

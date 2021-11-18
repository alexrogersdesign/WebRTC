import List from '@material-ui/core/List';

;/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {Paper, Typography} from '@material-ui/core';

import {RestContext} from '../../context/rest/RestContext';
import MeetingListItem from './MeetingListItem';

interface Props {
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
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
    delete: {
      // padding: theme.spacing(0, 70, 0),
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
  }),
);

const MeetingList = (props:Props) => {
  const classes = useStyles();
  const {meetingList, meetingsLoading} = useContext(RestContext);
  return (
    <Paper className={classes.paper} elevation={3} >
      <Typography
        className={classes.title}
        variant='h4'
        align='center'
        // color='textSecondary'
      >
          Meetings
      </Typography>
      <List className={classes.list} id={'meeting-list'}>
        {meetingList?.map((meeting) =>
          <MeetingListItem key={meeting.id.toString()} meeting={meeting}/>,
        )}
        {meetingsLoading && (
          <LinearProgress variant='query'/>
        )}
      </List>
    </Paper>
  );
};

export default MeetingList;

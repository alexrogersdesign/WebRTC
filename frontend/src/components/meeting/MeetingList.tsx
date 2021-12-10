import React, {useContext} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {Paper, Typography} from '@material-ui/core';
import List from '@material-ui/core/List';

import {RestContext} from '../../context/RestContext';
import MeetingListItem from './MeetingListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '65vw',
      [theme.breakpoints.down('sm')]: {
        width: '80vw',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100vw',
      },
    },
    title: {
      margin: theme.spacing(2, 1, 1),
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
      flexShrink: 1,
    },
    delete: {
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
  }),
);

const MeetingList = () => {
  const classes = useStyles();
  const {meetingList, meetingsLoading} = useContext(RestContext);
  return (
    <Paper className={classes.paper} elevation={3} >
      <Typography
        className={classes.title}
        variant='h4'
        align='center'
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

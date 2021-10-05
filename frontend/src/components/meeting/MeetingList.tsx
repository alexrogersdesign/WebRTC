import List from '@material-ui/core/List';

;/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';

import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {RestContext} from '../../context/rest/RestContext';
import {ListItem, Paper} from '@material-ui/core';
import MeetingItem from './MeetingItem';

interface Props {
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  return (
    <Paper className={classes.paper}>
      <List className={classes.list}>
        {meetingList?.map((meeting) =>
          <ListItem key={meeting.id.toString()} className={classes.item}>
            <MeetingItem meeting={meeting}/>
          </ListItem>,
        )}
      </List>
    </Paper>
  );
};

export default MeetingListDisplay;

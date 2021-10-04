import List from '@material-ui/core/List';

;/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';

import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {RestContext} from '../../context/rest/RestContext';

interface Props {
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: 'flex',
      // alignItems: 'flex-start',
    },
  }),
);

const MeetingListDisplay = (props:Props) => {
  const classes = useStyles();
  const {meetingList} = useContext(RestContext);
  return (
    <List>
      {meetingList?.map((meeting) =>
        <MeetingListDisplay key={meeting.id.toString()} meeting={meeting}/>)}
    </List>
  );
};

export default MeetingListDisplay;

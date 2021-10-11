import List from '@material-ui/core/List';

;/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';

import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {RestContext} from '../../context/rest/RestContext';
import {ListItem, Paper, Typography} from '@material-ui/core';
import MeetingItem from './MeetingItem';
import {SocketIOContext} from '../../context/SocketIOContext';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AlertDialog from './AlertDialog';
import Meeting from '../../shared/classes/Meeting';

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
    delete: {
      // padding: theme.spacing(0, 70, 0),
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
  }),
);

const MeetingListDisplay = (props:Props) => {
  const classes = useStyles();
  const {meetingList, deleteMeeting} = useContext(RestContext);
  const {joinMeeting} = useContext(SocketIOContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const handleDelete = (meeting:Meeting) => {

  };
  return (
    <Paper className={classes.paper} elevation={3} >
      <Typography className={classes.title} variant='h4'>
          Meetings
      </Typography>
      <List className={classes.list}>
        {meetingList?.map((meeting) =>
          <MeetingItem key={meeting.id.toString()} meeting={meeting}/>,
        )}
      </List>
    </Paper>
  );
};

export default MeetingListDisplay;

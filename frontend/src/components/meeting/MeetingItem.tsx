/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import ToolTip from '@material-ui/core/Tooltip';
import Meeting from '../../shared/classes/Meeting';

interface Props {
  meeting: Meeting
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      // alignItems: 'flex-start',
    },
    secondary: {
      // padding: theme.spacing(0, 70, 0),
      // alignSelf: 'flex-start',
    },
  }),
);

const MeetingItem = ({meeting}: Props) => {
  const classes = useStyles();
  const meetingPrimary = `${meeting?.title}`;
  const meetingSecondary = `ID: ${meeting?.id}`;
  return (
    <ListItem
      alignItems='flex-start'
      className={classes.listItem}
      button
      style={{backgroundColor: 'transparent', cursor: 'default'}}
      disableRipple={true}
    >
      <ListItemText primary={meetingPrimary} secondary={meetingSecondary} />
    </ListItem>
  );
};

export default MeetingItem;

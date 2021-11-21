import MeetingMenuDisplay from '../meeting/MeetingMenuDisplay';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NoMeetingRoomIcon from '@material-ui/icons/NoMeetingRoom';
import ListItemText from '@material-ui/core/ListItemText';
import React, {useContext} from 'react';
import {SocketIOContext} from '../../context/SocketIOContext';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {RestContext} from '../../context/rest/RestContext';

const useStyles = makeStyles(() =>
  createStyles({
    red: {
      color: '#f44336',
    },
  }),
);

/**
 * The components to render when a meeting is joined
 * @return {JSX.Element}
 * @function
 */
export default function RenderWhenMeeting() {
  const classes = useStyles();
  const {meeting, leaveMeeting} = useContext(SocketIOContext);
  const {currentUser} = useContext(RestContext);
  const leaveDialog = 'Leave meeting';
  if (meeting && currentUser) {
    return (
      <>
        <MeetingMenuDisplay meeting={meeting}/>
        <ListItem
          button
          onClick={leaveMeeting}
          id='leave-meeting-button'
          aria-label= 'leave meeting button'
        >
          <ListItemIcon className={classes.red}>
            <NoMeetingRoomIcon />
          </ListItemIcon>
          <ListItemText primary={leaveDialog} />
        </ListItem>
      </>
    );
  } else return <></>;
}

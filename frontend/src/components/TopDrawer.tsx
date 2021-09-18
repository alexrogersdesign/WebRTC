import React, {useState, useContext} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import CreateIcon from '@material-ui/icons/Create';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import NoMeetingRoomIcon from '@material-ui/icons/NoMeetingRoom';
import Typography from '@material-ui/core/Typography';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

import JoinMeetingModal from './JoinMeetingModal';
import MeetingListDisplay from './MeetingListDisplay';
import {SocketIOContext} from '../context/SocketIOContext';

interface Props {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignContent: 'flex-end',
      width: '100%',
      // borderWidth: 20,
    },
    list: {
      // width: '60%',
    },
    fullList: {
      width: 'auto',
    },
    drawer: {
      // width: '60% !important',
      backgroundColor: 'rgb(255,255,255,.6)',
    },
    red: {
      // fill: 'red',
      color: '#f44336',
    },
    drawerButton: {
      alignSelf: 'flex-end',
    },
  }),
);

export const TopDrawer = (props: Props) => {
  const classes = useStyles();
  const {meeting, leaveMeeting, startNewMeeting} = useContext(SocketIOContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);


  const toggleDrawer = (open:boolean) => (event:any) => {
    if (event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };


  const joinDialog = 'Join an existing meeting';
  const createDialog = 'Create a new meeting';
  const leaveDialog = 'Leave meeting';

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer( false)}
      onKeyDown={toggleDrawer( false)}
    >
      <List>
        {!meeting && (
          <>
            <ListItem button onClick={startNewMeeting}>
              <ListItemIcon> <CreateIcon /></ListItemIcon>
              <ListItemText primary={createDialog} />
            </ListItem>
            <ListItem button onClick={() => setModalOpen(true)} >
              <ListItemIcon> <MeetingRoomIcon /></ListItemIcon>
              <ListItemText primary={joinDialog} />
            </ListItem>
          </>

        )}
        {meeting && (
          <>
            <MeetingListDisplay meeting={meeting}/>
            <ListItem button onClick={leaveMeeting}>
              <ListItemIcon className={classes.red}>
                <NoMeetingRoomIcon />
              </ListItemIcon>
              <ListItemText primary={leaveDialog} />
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <List>
        {items.map((text, index) => (
          <ListItem button key={index}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  const items:(JSX.Element | string)[] = [

  ];

  return (
    <div className={classes.root}>
      <React.Fragment>
        <IconButton
          // className={classes.drawerButton}
          onClick={toggleDrawer(true)}
          edge="end"
        >
          <ViewHeadlineIcon/>
          <Typography variant="h6" noWrap >
           Menu
          </Typography>
        </IconButton>
        <Drawer
          className={classes.drawer}
          anchor='top'
          open={drawerOpen}
          onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
        <JoinMeetingModal open={modalOpen} setOpen={setModalOpen}/>
      </React.Fragment>
    </div>
  );
};
export default TopDrawer;


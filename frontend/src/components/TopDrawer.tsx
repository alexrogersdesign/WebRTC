/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, {useState, useContext} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
// import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';


import MeetingForm from './MeetingForm';
import JoinMeetingModal from './JoinMeetingModal';

import {SocketIOContext} from '../context/SocketIOContext';

interface Props {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

export const TopDrawer = (props: Props) => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);


  const toggleDrawer = (open:boolean) => (event:any) => {
    if (event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
    //  if (!open) setModalOpen(false);
  };

  const {meeting, leaveMeeting, startNewMeeting} = useContext(SocketIOContext);
  const list = () => (
    <div
      // className={clsx(classes.list, {
      //   [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      // })}
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer( false)}
      onKeyDown={toggleDrawer( false)}
    >
      <List>
        {!meeting && (
          <>
            {/* <ListItem>
              {<MeetingForm />}
            </ListItem> */}
            <ListItem button onClick={startNewMeeting}>
              <ListItemIcon> <InboxIcon /></ListItemIcon>
              <ListItemText primary={'Start New Meeting'} />
            </ListItem>
            <ListItem button onClick={() => setModalOpen(true)} >
              <ListItemIcon> <InboxIcon /></ListItemIcon>
              <ListItemText primary={'Join a Meeting'} />
            </ListItem>
          </>

        )}
        {meeting && (
          <>
            <ListItem>
              <ListItemIcon> <InboxIcon /></ListItemIcon>
              <ListItemText primary={`Meeting ID: ${meeting.id}`} />
            </ListItem>
            <ListItem button onClick={leaveMeeting}>
              <ListItemIcon> <InboxIcon /></ListItemIcon>
              <ListItemText primary={'Leave Meeting'} />
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <List>
        {items.map((text, index) => (
          <ListItem button key={index}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  const items:(JSX.Element | string)[] = [

  ];

  return (
    <div>
      <React.Fragment >
        <Button
          onClick={toggleDrawer(true)}
          variant="outlined"
        >
           Meeting Controls
        </Button>
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


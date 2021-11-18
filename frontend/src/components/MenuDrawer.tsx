/* eslint-disable no-unused-vars */
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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FiberNewIcon from '@material-ui/icons/FiberNew';

import MeetingMenuDisplay from './meeting/MeetingMenuDisplay';
import {SocketIOContext} from '../context/SocketIOContext';
import {RestContext} from '../context/rest/RestContext';
import ModalWrapper from './common/ModalWrapper';
import LoginForm from './forms/LoginForm';
import JoinMeetingForm from './forms/JoinMeetingForm';
import NewUserForm from './forms/NewUserForm';
import NewMeetingForm from './forms/NewMeetingForm';
import {Alert} from '@material-ui/lab';

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

export const MenuDrawer = (props: Props) => {
  const classes = useStyles();
  const {meeting, leaveMeeting, startNewMeeting} = useContext(SocketIOContext);
  const {loggedIn, logout} = useContext(RestContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [joinMeetingModalOpen, setJoinMeetingModal] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [createMeetingModalOpen, setCreateMeetingModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);


  const toggleDrawer = (open:boolean) => (event:any) => {
    if (event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  /**
     * The components to render when no meeting is joined
     * @return {React.jsx} The React components
     */
  const RenderWhenNoMeeting = () => {
    const joinDialog = 'Join an existing meeting';
    const createDialog = 'Create a new meeting';
    if (!meeting) {
      return (
        <>
          <ListItem
            button
            onClick={() => setCreateMeetingModalOpen(true)}
            id='create-meeting-button'
            aria-label='create meeting button'
          >
            <ListItemIcon> <CreateIcon /></ListItemIcon>
            <ListItemText primary={createDialog} />
          </ListItem>
          <ListItem
            button
            onClick={() => setJoinMeetingModal(true)}
            id='join-meeting-button'
            aria-label='join meeting button'
          >
            <ListItemIcon> <MeetingRoomIcon /></ListItemIcon>
            <ListItemText primary={joinDialog} />
          </ListItem>
          <LogoutButton/>
        </>
      );
    } else return <></>;
  };
  const LogoutButton = () => {
    const logoutDialog = 'Logout';
    return (
      <>
        <ListItem
          button
          onClick={logout}
          id='logout-button'
          aria-label='logout button'
        >
          <ListItemIcon className={classes.red}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={logoutDialog} />
        </ListItem>
      </>
    );
  };
  /**
     * The components to render when a meeting is joined
     * @return {React.jsx} The React components
     */
  const RenderWhenMeeting = () => {
    const leaveDialog = 'Leave meeting';
    if (meeting) {
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
  };
  /**
     * The components to render when not logged in
     * @return {React.jsx} The React components
     */
  const RenderWhenNotLogged = () => {
    const loginDialog = 'Login';
    const createAccountDialog = 'Create Account';
    return (<>
      <ListItem
        button
        onClick={() => setCreateAccountModalOpen(true)}
        id='create-account-button'
        aria-label='create account button'
      >
        <ListItemIcon> <FiberNewIcon /></ListItemIcon>
        <ListItemText primary={createAccountDialog} />
        <Alert icon={false} severity="success">
              An account can be created here
        </Alert>
      </ListItem>
      <ListItem
        button
        onClick={() => setLoginModalOpen(true)}
        id='login-button'
        aria-label='login button'
      >
        <ListItemIcon> <ExitToAppIcon /></ListItemIcon>
        <ListItemText primary={loginDialog} />
        <Alert icon={false} severity="success">
            Demo account provided
        </Alert>
      </ListItem>
    </>);
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer( false)}
      onKeyDown={toggleDrawer( false)}
    >
      <List>
        {(!meeting && loggedIn) && <RenderWhenNoMeeting/>}
        {(meeting && loggedIn) && <RenderWhenMeeting/>}
        {!loggedIn && <RenderWhenNotLogged/>}
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
          // color="inherit"
          onClick={toggleDrawer(true)}
          aria-label="open drawer"
          edge="end"
        >
          <ViewHeadlineIcon/>
          <Typography variant="h6" noWrap id='menu-button' >
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
        <ModalWrapper
          Component={JoinMeetingForm}
          open={joinMeetingModalOpen}
          setOpen={setJoinMeetingModal}
        />
        <ModalWrapper
          open={loginModalOpen}
          setOpen={setLoginModalOpen}
          Component={LoginForm}
        />
        <ModalWrapper
          open={createAccountModalOpen}
          setOpen={setCreateAccountModalOpen}
          Component={NewUserForm}
        />
        <ModalWrapper
          open={createMeetingModalOpen}
          setOpen={setCreateMeetingModalOpen}
          Component={NewMeetingForm}
        />

        {/* <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen}/>*/}

      </React.Fragment>
    </div>
  );
};
export default MenuDrawer;


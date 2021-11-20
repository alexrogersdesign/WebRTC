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
import AccountInfo from './common/AccountInfo';
import TutorialPrompt from './common/TutorialPrompt';
import EnableTutorial from './common/EnableTutorial';
import TutorialWrapper from './common/TutorialWrapper';
import HelpButton from './common/HelpButton';
import DemoPrompt from './common/DemoPrompt';

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
    topItems: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  }),
);

export const MenuDrawer = (props: Props) => {
  const classes = useStyles();
  const {meeting, leaveMeeting} = useContext(SocketIOContext);
  const {logout, currentUser} = useContext(RestContext);
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
    return (
      <>
        <ListItem
          button
          onClick={() => setCreateAccountModalOpen(true)}
          id='create-account-button'
          aria-label='create account button'
        >
          <ListItemIcon> <FiberNewIcon /></ListItemIcon>
          <ListItemText primary={createAccountDialog} />
        </ListItem>
        <ListItem
          button
          onClick={() => setLoginModalOpen(true)}
          id='login-button'
          aria-label='login button'
        >
          <ListItemIcon> <ExitToAppIcon /></ListItemIcon>
          <ListItemText primary={loginDialog} />
        </ListItem>
      </>);
  };
  const RenderWhenLogged = () => {
    if (!currentUser) return <></>;
    return (
      <AccountInfo/>
    );
  };
  const RenderTutorial = () => {
    const homePrompt= 'You are not logged in.' +
        ' Click the menu button to proceed.';
    const loginMenuPrompt ='You can create an account' +
        '\nor click Login to proceed with a demo account';
    const meetingListPrompt = 'Click a meeting below to join' +
        ' or the menu icon for more options';
    const joinedMeetingPrompt = 'Click and hold the help button at the top to' +
        ' display the help menu. Double click to keep the help menu open ';
    return (
      <>
        {(!currentUser && !loginModalOpen && !createAccountModalOpen) && (
          <>
            <TutorialPrompt
              defaultOpen={!drawerOpen}
              synchronizeClose={drawerOpen}
              message={homePrompt}
              verticalOffset={'10%'}
            />
            <TutorialPrompt
              defaultOpen={drawerOpen}
              anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
              message={loginMenuPrompt}
              verticalOffset={'20%'}
            />
          </>
        )}
        {(currentUser &&
            !meeting &&
            !joinMeetingModalOpen &&
            !createMeetingModalOpen) &&(
          <TutorialPrompt
            defaultOpen={!drawerOpen}
            verticalOffset={'5%'}
            horizontalOffset={'70%'}
            message={meetingListPrompt}
          />
        )}
        {(currentUser &&
            meeting) &&(
          <TutorialPrompt
            defaultOpen={!drawerOpen}
            verticalOffset={'10%'}
            horizontalOffset={'60%'}
            message={joinedMeetingPrompt}
          />
        )}
      </>
    );
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer( false)}
      onKeyDown={toggleDrawer( false)}
    >
      <div className={classes.topItems}>
        <EnableTutorial/>
        <RenderWhenLogged/>
      </div>
      <Divider />
      <List>
        {(!meeting && currentUser) && <RenderWhenNoMeeting/>}
        {(meeting && currentUser) && <RenderWhenMeeting/>}
        {!currentUser && <RenderWhenNotLogged/>}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <>
        <HelpButton/>
        <IconButton
          onClick={toggleDrawer(true)}
          aria-label="open drawer"
          edge="end"
        >
          <ViewHeadlineIcon/>
          <TutorialWrapper
            message={'Use the menu to leave the meeting'}
            tooltipProps={{placement: 'bottom-end'}}
          >
            <Typography variant="h6" noWrap id='menu-button' >
           Menu
            </Typography>
          </TutorialWrapper>
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
        <RenderTutorial/>
      </>
    </div>
  );
};
export default MenuDrawer;


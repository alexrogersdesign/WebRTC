import React, {useContext} from 'react';
import clsx from 'clsx';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';

import Menu from './menu/Menu';
import Meeting from '@webrtc/backend/dist/shared/classes/Meeting';
import AttendeeDrawer from './attendee/AttendeeDrawer';
import AttendeeDrawerButton from './attendee/AttendeeDrawerButton';
import {AppStateContext} from '../context/AppStateContext';

interface Props {
   meeting: Meeting | undefined| null,
}

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      //* necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    toolbarItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    menuButton: {
      marginRight: 36,
    },
  }),
);
/**
 * Renders the top application bar.
 * @param {Meeting | undefined | null} meeting An object representing the
 * current joined meeting, or null if a meeting is not currently joined.
 * @return {JSX.Element}
 * @function
 */
export const ControlBar = ({meeting}: Props) => {
  const classes = useStyles();
  const {
    attendeeDrawerOpen,
    setAttendeeDrawerOpen,
  } = useContext(AppStateContext);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: attendeeDrawerOpen,
        })}
      >
        <Toolbar
          classes={{root: classes.toolbarItem}}
        >
          {meeting &&(
            <AttendeeDrawerButton
              setOpen={setAttendeeDrawerOpen}
              open={attendeeDrawerOpen}
            />
          )}
          <Menu/>
        </Toolbar>
      </AppBar>
      {meeting &&(
        <AttendeeDrawer
          toolbarStyle={classes.toolbar}
          setOpen={setAttendeeDrawerOpen}
          open={attendeeDrawerOpen}
          drawerWidth={drawerWidth}
        />
      )}
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
  );
};

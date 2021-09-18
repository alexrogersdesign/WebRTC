/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, {useState} from 'react';
import clsx from 'clsx';
import {makeStyles, Theme, createStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TopBar from './TopBar';


import VideoAvatar from './VideoAvatar';
import TopDrawer from './TopDrawer';
import {User, Meeting} from '../types';
import AttendeeListItem from './AttendeeListItem';

interface Props {
   users: User[]| undefined,
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
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 12,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 12,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      //* necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    list: {
      // padding: theme.spacing(0),
    },
    listItemText: {
      padding: theme.spacing(0, 2),
    },
  }),
);


export const AttendeeDrawer = ({users, meeting}: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const hideWhenOpen = {display: open? 'none': 'flex'};
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar >
          <IconButton
            style={{display: meeting? 'flex': 'none'}}
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <PeopleAltIcon style={hideWhenOpen}/>
            <Typography style={hideWhenOpen} variant="h6" >
              Attendees
            </Typography>
          </IconButton>
          <TopDrawer/>
        </Toolbar>
      </AppBar>
      {meeting && (<Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <Typography variant='h6'>Attendees</Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List className={classes.list} >
          {users && users.map((user) => {
            // const labelId = `checkbox-list-secondary-label-${user.id}`;
            // const name = `${user.firstName} ${user.lastName}`;
            return (
              <AttendeeListItem key={user.id} user={user}/>
              // <ListItem key={user.id} button>
              //   <ListItemAvatar>
              //     <VideoAvatar
              //       user={user}
              //     />
              //   </ListItemAvatar>
              //   <ListItemText
              //     className={classes.listItemText}
              //     id={labelId}
              //     primary={name}
              //   />
              //   {/* <ListItemSecondaryAction>

            //   </ListItemSecondaryAction> */}
            //   <Divider variant='middle' />
            // </ListItem>
            );
          })}
        </List>
      </Drawer>)}
      <main className={classes.content}>
        <div className={classes.toolbar} />

      </main>
    </div>
  );
};

/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import clsx from 'clsx';
import {makeStyles,
  Theme,
  createStyles,
  useTheme,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import {User, Meeting} from '../../types';
import ChatBox from './ChatBox';

interface Props {
  //  users: User[]| undefined,
   meeting: Meeting | undefined| null,
}

const drawerWidth = 340;

const offset = 70;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      // justifyContent: 'center',
      // float: 'left',
      // left: 0,
      // top: 20,
      // ...theme.mixins.toolbar,
    },
    appBar: {
      top: offset,
      width: '15%',
      // zIndex: theme.zIndex.drawer + 1,
      // transition: theme.transitions.create(['width', 'margin'], {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.leavingScreen,
      // }),
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      //
      display: 'none',
      width: `calc(50% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: drawerWidth,
    },
    title: {
      // flexGrow: 1,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      top: offset,
      width: drawerWidth,
      // opacity: 0.95,
      backgroundColor: 'rgba(255,255,255,0)',
      outline: 0,
      borderWidth: 0,
    },
    drawerHeader: {
      // backgroundColor: 'rgba(255,255,255,1)',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      // ...theme.mixins.toolbar,
      justifyContent: 'flex-start',
    },
    iconButton: {
      backgroundColor: theme.palette.secondary.light,
      margin: theme.spacing(1),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
  }),
);


const ChatDrawer = ({meeting}: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);

  const handleDrawerClose = () => setOpen(false);

  const hideWhenOpen = {
    // display: open? 'none': 'flex'
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <ChatBubbleOutlineIcon />
            <Typography variant="h6" noWrap className={classes.title}>
            Chat
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
      <Drawer
        hideBackdrop
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        // PaperProps={{style: {borderWidth: 0}}}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton
            className={classes.iconButton}
            onClick={handleDrawerClose}
            size='small'
          >
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        {/* <Divider /> */}
        <ChatBox/>
      </Drawer>
    </div>
  );
};

export default ChatDrawer
;

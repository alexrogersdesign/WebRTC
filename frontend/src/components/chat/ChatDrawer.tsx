/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {useState, useRef, useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles,
  Theme,
  createStyles,
  useTheme,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@material-ui/core/Chip';
import ChatBubbleTwoToneIcon from '@material-ui/icons/ChatBubbleTwoTone';

import ChatBox from './ChatBox';
import {MemoizedHelpWrapper} from '../tutorial/HelpWrapper';


type StyleRef = React.MutableRefObject<HTMLDivElement | undefined>

const drawerWidth = 340;

const offset = 90;
const useStyles = makeStyles<Theme, StyleRef>((theme: Theme) =>
  createStyles({
    drawerButton: {
      position: 'fixed',
      top: '15%',
      right: '0',
      float: 'right',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    drawerButtonOpen: (props) => ({
      display: 'none',
      width: `calc(50% - ${props.current?.offsetWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: props.current?.offsetWidth,
    }),
    openIcon: {
      padding: theme.spacing(1),
      margin: theme.spacing(1),
    },
    hide: {
      display: 'none',
    },
    drawer: (props) => ({
      width: props.current?.offsetWidth,
      flexShrink: 0,
    }),
    drawerPaper: {
      top: offset,
      backgroundColor: 'rgba(255,255,255,0)',
      outline: 0,
      borderWidth: 0,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      justifyContent: 'flex-start',
    },
    closeIcon: {
      backgroundColor: theme.palette.secondary.light,
      margin: theme.spacing(1),
    },
    content: (props) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: props.current?.offsetWidth?
        -props.current?.offsetWidth :
        drawerWidth,
    }),
    contentOpen: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
    openTooltip: {
      overflowWrap: 'break-word',
      transform: 'translate(-20px, 0)',
    },
    closeTooltip: {
      overflowWrap: 'break-word',
      margin: '10px 0',
    },
  }),
);
/**
 * Renders the chat drawer component which is a collapsable display
 * that contains a chat box which displays the meeting messages.
 * The component is only displayed if a meeting is passed to it.
 * @param {Meeting | undefined | null} meeting The meeting used to
 * decide whether or not to render the component.
 * @return {JSX.Element}
 * @constructor
 */
const ChatDrawer = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>();
  const classes = useStyles(chatBoxRef);
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);
  const chatBottomRef = useRef<HTMLDivElement>(null!);
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({behavior: 'smooth'});
  };
  useEffect(() => {
    if (drawerOpen) scrollToBottom();
  }, [drawerOpen]);
  return (
    <div>
      <div
        className={clsx(classes.drawerButton, {
          [classes.drawerButtonOpen]: drawerOpen,
        })}
      >
        <MemoizedHelpWrapper
          message={'Open the chat'}
          tooltipProps={{placement: 'bottom-start'}}
          tooltipClass={classes.openTooltip}
        >
          <Chip
            className={classes.openIcon}
            id={'open-chat-button'}
            aria-label="open drawer"
            color='secondary'
            size='medium'
            label='Chat'
            clickable
            onClick={handleDrawerOpen}
            icon={<ChatBubbleTwoToneIcon/>}
          />
        </MemoizedHelpWrapper>
      </div>
      <main
        className={clsx(classes.content, {
          [classes.contentOpen]: drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <MemoizedHelpWrapper
            message={'Close the meeting chat'}
            tooltipProps={{placement: 'bottom-end'}}
            tooltipClass={classes.closeTooltip}
          >
            <IconButton
              id={'close-chat-button'}
              className={classes.closeButton}
              onClick={handleDrawerClose}
              size='small'
            >
              {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </MemoizedHelpWrapper>
        </div>
        <ChatBox innerRef={chatBoxRef} isOpen={drawerOpen}/>
        <div ref={chatBottomRef}/>
      </Drawer>
    </div>
  );
};

export default ChatDrawer;

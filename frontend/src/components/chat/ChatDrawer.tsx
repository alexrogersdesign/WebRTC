/* eslint-disable no-unused-vars */
import React, {useState, useRef} from 'react';
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
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';

import ChatBox from './new/ChatBox';
import {MemoizedHelpWrapper} from '../tutorial/HelpWrapper';
import {ButtonBase, Tooltip} from '@material-ui/core';


type StyleRef = React.MutableRefObject<HTMLDivElement | undefined>

const drawerWidth = 340;

const offset = 90;
const useStyles = makeStyles<Theme, StyleRef>((theme: Theme) =>
  createStyles({
    drawerButton: {
      position: 'fixed',
      top: '10%',
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
      transform: 'rotateY(180deg)',
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
      position: 'absolute',
      backgroundColor: 'white',
      zIndex: 10,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 10,
      color: theme.palette.secondary.main,

      borderTop: `1px solid ${theme.palette.grey[400]}`,
      borderLeft: `1px solid ${theme.palette.grey[400]}`,
      borderRight: `1px solid ${theme.palette.grey[500]}`,
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
    },
    closeIcon: {
      'width': 'inherit',
      '&:hover, &.Mui-focusVisible': {
        'color': theme.palette.grey['200'],
      },
      'borderTopLeftRadius': 5,
      'borderBottomRightRadius': 10,

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
    modal: {
      inset: 'unset !important',
    },
  }),
);
/**
 * Renders the chat drawer component which is a collapsable display
 * that contains a chat box which displays the meeting messages.
 * The component is only displayed if a meeting is passed to it.
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
          <div>
            <Tooltip
              title="Open Chat"
              placement="right"
              classes={{
                popper: clsx( {[classes.hide]: drawerOpen}),
              }}
            >
              <IconButton
                edge='end'
                id={'open-chat-button'}
                aria-label="open chat "
                className={classes.openIcon}
                onClick={handleDrawerOpen}
                size='medium'
              >
                <SpeakerNotesIcon fontSize={'large'}/>
              </IconButton>
            </Tooltip>
          </div>
        </MemoizedHelpWrapper>
      </div>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
          modal: classes.modal,
        }}
      >
        <div className={classes.drawerHeader}>
          <MemoizedHelpWrapper
            message={'Close the chat'}
            tooltipProps={{placement: 'bottom-end'}}
            tooltipClass={classes.closeTooltip}
          >
            <div>
              <Tooltip
                title="Close Chat"
                placement="left"
                classes={{
                  popper: clsx( {[classes.hide]: !drawerOpen}),
                }}
              >
                <ButtonBase
                  id={'close-chat-button'}
                  className={classes.closeIcon}
                  onClick={handleDrawerClose}
                  // size='small'
                >
                  {theme.direction === 'rtl' ?
                    <ChevronLeftIcon /> :
                    <ChevronRightIcon />}
                </ButtonBase>
              </Tooltip>
            </div>
          </MemoizedHelpWrapper>
        </div>
        <ChatBox
          innerRef={chatBoxRef}
          // isOpen={drawerOpen}
        />
      </Drawer>
    </div>
  );
};

export default ChatDrawer;

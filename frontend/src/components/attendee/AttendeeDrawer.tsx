import React, {useContext} from 'react';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';

import TutorialWrapper from '../Tutorial/TutorialWrapper';
import AttendeeListItem from './AttendeeListItem';
import {MediaControlContext} from '../../context/MediaControlContext';
import {RestContext} from '../../context/rest/RestContext';

interface StyleProps {drawerWidth: number}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    drawer: (props) => ({
      width: props.drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    }),
    drawerOpen: (props) => ({
      width: props.drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
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
  }),
);

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
  drawerWidth: number
  toolbarStyle: string
}

/**
 * The attendee drawer element shows the meeting attendees in an
 * expandable drawer.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setOpen
 * The function that sets the open state of the drawer.
 * @param {boolean} open The open state of the drawer.
 * @param {number} drawerWidth The width of the drawer in pixels. This
 * is shared with the ControlBar and AttendeeDrawer components.
 * @param {string} toolbarStyle The Css toolbar className.
 * These styles are shared between ControlBar and AttendeeDrawer components.
 * @return {JSX.Element}
 * @function
 */
export default function AttendeeDrawer({
  setOpen,
  open,
  drawerWidth,
  toolbarStyle,
}:Props) {
  const classes = useStyles({drawerWidth});
  const theme = useTheme();

  const {meeting} = useContext(RestContext);
  const {externalMedia} = useContext(MediaControlContext);
  const users = externalMedia?.map(({user}) => user);

  const hideWhenClosed = {display: open? 'flex': 'none'};
  if (meeting) {
    return (
      <TutorialWrapper
        message={users?.length?
                'Click an user icon for more information':
                'When a user joins, their icon is shown here'
        }
        tooltipProps={{placement: 'right-end'}}
        watchItem={open}
      >
        <Drawer
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
          <div className={toolbarStyle}>
            <Typography variant='h6'>Attendees</Typography>
            <TutorialWrapper
              message={'Close attendees list'}
              tooltipProps={{placement: 'bottom-end'}}
              style={hideWhenClosed}
              watchItem={open}
            >
              <IconButton onClick={()=> setOpen(false)}>
                {
                  theme.direction === 'rtl' ?
                      <ChevronRightIcon /> :
                      <ChevronLeftIcon />
                }
              </IconButton>
            </TutorialWrapper>
          </div>
          <Divider />
          <List >
            {users.map((item) => {
              return (
                <AttendeeListItem key={item.id.toString()} user={item}/>
              );
            })}
          </List>
        </Drawer>
      </TutorialWrapper>
    );
  } else return <></>;
}

/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {Collapse, Paper, Typography} from '@material-ui/core';
import List from '@material-ui/core/List';
import {TransitionGroup} from 'react-transition-group';

import {RestContext} from '../../context/RestContext';
import MeetingListItem from './MeetingListItem';
import {alpha} from '@material-ui/core/styles/colorManipulator';
import {
  ReactComponent as VideoCall,
} from '../../util/files/img/VideoCall.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '40em',
      transition: theme.transitions.create(['height'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.down('sm')]: {
        width: '40em',
      },
      [theme.breakpoints.down('xs')]: {
        width: '90vw',
      },
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      border: `1px solid ${theme.palette.grey[500]}`,
      borderBottom: `1px solid ${theme.palette.grey[600]}`,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.secondary.light, 1),
    },
    icon: {
      height: 100,
      width: 100,
      marginTop: 'auto',
      marginBottom: 'auto',
      marginLeft: '5%',
      flexShrink: 0,
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginLeft: '5%',
      marginRight: '5%',
      padding: theme.spacing(1, 0, 1),
      width: '11em',
      height: '9em',
    },
    title: {
      fontSize: 36,
    },
    description: {
      fontSize: 16,
      width: 200,
      margin: theme.spacing(0, 2),
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignItems: 'stretch',
      justifyContent: 'center',
      alignContent: 'stretch',
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
      borderLeft: `1px solid ${theme.palette.grey[500]}`,
      borderRight: `1px solid ${theme.palette.grey[500]}`,
      borderBottomRightRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    item: {
      flexShrink: 1,
    },
    delete: {
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
  }),
);
/**
 * Renders the available meetings in a list of clickable buttons.
 * @return {JSX.Element}
 * @constructor
 */
const MeetingList = () => {
  const classes = useStyles();
  const {meetingList, meetingsLoading} = useContext(RestContext);
  return (
    <Paper className={classes.paper} elevation={3} >
      <div className={classes.header}>
        <VideoCall className={classes.icon}/>
        <div className={classes.titleContainer}>
          <Typography
            className={classes.title}
            component='h1'
            variant='h6'
            align='center'
          >
          Meetings
          </Typography>
          <Typography
            className={classes.description}
            variant='h5'
            align='center'
            component='p'
          >
            {
              meetingsLoading? 'Loading, please wait' :
                'A list of the meetings available to join'
            }
          </Typography>
        </div>
      </div>
      <List
        className={classes.list}
        id={'meeting-list'}
        disablePadding
      >
        <TransitionGroup>
          {meetingList?.map((meeting, index) =>
            <Collapse key={meeting.id.toString()}>
              <MeetingListItem
                meeting={meeting}
                /** Dont add divider to last item */
                divider={index < meetingList.length -1}
              />
            </Collapse>,
          )}
        </TransitionGroup>
        {meetingsLoading && (
          <LinearProgress variant='query'/>
        )}
      </List>
    </Paper>
  );
};

export default MeetingList;

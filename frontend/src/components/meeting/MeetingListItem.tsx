/* eslint-disable no-unused-vars */
import React, {useState, useContext} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import ToolTip from '@material-ui/core/Tooltip';
import Meeting from '../../shared/classes/Meeting';
import AlertDialog from '../common/AlertDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {RestContext} from '../../context/RestContext';
import {toLocalStringMonth} from '../../shared/util/timeHelpers';
import Avatar from '@material-ui/core/Avatar';
import {toTitleCase} from '../../shared/util/helpers';
import {alpha} from '@material-ui/core/styles/colorManipulator';
import ModalWrapper from '../common/ModalWrapper';
import MeetingCard, {MeetingCardProps} from './MeetingCard';
import clsx from 'clsx';

interface Props {
  meeting: Meeting
  divider?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      'display': 'flex',
      'flexDirection': 'row',
      'justifyContent': 'center',
      'alignItems': 'center',
      'flexShrink': 1,
      '&:hover': {
        backgroundColor: alpha(theme.palette.secondary.light, .2),
        // color: '#3c52b2',
      },
    },
    delete: {
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 5,
    },
    itemText: {
      padding: theme.spacing(0, 1, 0),
    },
    primaryText: {
      marginBottom: -5,
      [theme.breakpoints.down('xs')]: {
        fontSize: 16,
      },
    },
    secondaryText: {
      color: theme.palette.grey[700],
    },
    hide: {
      visibility: 'hidden',
    },
  }),
);

const MeetingListItem = ({meeting, divider}: Props) => {
  if (!meeting) return <></>;
  const classes = useStyles();
  const {deleteMeeting} = useContext(RestContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const handleDelete = () => {
    void deleteMeeting(meeting.id.toString());
  };

  const meetingPrimary = `${toTitleCase(meeting.title)}`;
  const meetingSecondary = toLocalStringMonth(meeting.start);
  return (
    <>
      <ListItem
        alignItems='flex-start'
        onClick={()=>setJoinModalOpen(true)}
        className={classes.listItem}
        button
        divider={divider}
        disableRipple
      >
        <Avatar
          className={clsx(classes.logo, {
            [classes.hide]: !meeting.icon,
          })}
          variant={'rounded'}
          src={meeting.icon}
        />
        <ListItemText
          className={classes.itemText}
          primary={meetingPrimary}
          primaryTypographyProps={{
            id: 'meeting-title',
            color: 'primary',
            variant: 'h6',
            className: classes.primaryText,
          }}
          secondary={meetingSecondary}
          secondaryTypographyProps={{
            id: 'meeting-start',
            variant: 'subtitle2',
            className: classes.secondaryText,
            // color: theme.palette.augmentColor(theme.palette.primary),
          }}
        />
        <ListItemSecondaryAction>
          <ToolTip title="Delete Meeting">
            <IconButton
              className={classes.delete}
              onClick={() => setAlertOpen(true)}
              edge='end'
              aria-label="Delete Meeting">
              <DeleteIcon />
            </IconButton>
          </ToolTip>
        </ListItemSecondaryAction>
      </ListItem>
      <AlertDialog
        open={alertOpen}
        setOpen={setAlertOpen}
        title={'Delete Meeting?'}
        dialog={'Are you sure you want to Delete?'}
        action={handleDelete}
        confirmLabel={'Delete'}
        cancelLabel={'Cancel'}
        warn
      />
      <ModalWrapper<MeetingCardProps>
        WrappedComponent={MeetingCard}
        componentProps={{
          meeting,
          setOpen: setJoinModalOpen,
        }}
        modalOpen={joinModalOpen}
        setModalOpen={setJoinModalOpen}
        fastExit
      />
    </>
  );
};

export default MeetingListItem;

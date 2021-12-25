/* eslint-disable no-unused-vars */
import React, {useContext, forwardRef} from 'react';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Button from '@material-ui/core/Button';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';

import Meeting from '../../shared/classes/Meeting';
import PropTypes from 'prop-types';
import {ChildrenProps} from '../../shared/types';
import {
  getTimeDiffMinutes,
  toLocalStringMonth,
} from '../../shared/util/timeHelpers';
import {AppStateContext} from '../../context/AppStateContext';
import {demoUsers} from '../../shared/util/demoItems';
import UserAvatar from '../common/UserAvatar';
import {toTitleCase} from '../../shared/util/helpers';
import {Chip} from '@material-ui/core';
import clsx from 'clsx';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

export interface MeetingCardProps extends ChildrenProps{
    meeting: Meeting
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const mediaWidth = 160;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '50em',
      [theme.breakpoints.down('sm')]: {
        width: '45em',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100vw',
      },
    },
    button: {
      border: `1px solid ${theme.palette.primary.dark}`,
      margin: theme.spacing(1),
    },
    avatar: {
      fontSize: '0.875rem',
      boxShadow: theme.shadows[0],
      border: '1px solid transparent',
    },
    card: {
      display: 'flex',
    },
    cardDetails: {
      flex: 1,
      [theme.breakpoints.down('xs')]: {
        minHeight: '45vh',
      },
    },
    cardMedia: {
      width: mediaWidth,
      [theme.breakpoints.down('xs')]: {
        width: '30%',
      },
    },
    cardContent: {
      [theme.breakpoints.down('xs')]: {
        minHeight: '30vh',
      },
    },
    descriptor: {
      fontWeight: 'bold',
      paddingRight: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    duration: {
      bottom: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
      [theme.breakpoints.up('xs')]: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
    users: {
      position: 'absolute',
      [theme.breakpoints.up('xs')]: {
        bottom: theme.spacing(1),
        right: theme.spacing(1),

      },
      [theme.breakpoints.down('xs')]: {
        bottom: theme.spacing(1),
        left: theme.spacing(1),
      },
    },
    iconOffset: {
      right: `calc(${mediaWidth}px + ${theme.spacing(1)}px)`,
    },
    title: {
      [theme.breakpoints.down('xs')]: {
        fontSize: 18,
      },
    },
    start: {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      fontSize: 40,
      color: theme.palette.secondary.dark,
      [theme.breakpoints.up('xs')]: {
        display: 'none',
      },
    },

  }),
);
/**
 * A forward reference exotic component that renders meeting information
 * in the form of a card..
 * The component is intended to be rendered inside of a Modal.
 * A ref is forwarded through the component from it's props to a
 * div element wrapping DialogTitle and DialogContent. The forward ref allows
 * the form to be rendered in a Modal component transparently without
 * breaking any of the functionality of the Modal or introducing
 * accessibility issues.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setOpen A function
 * that sets the state of a boolean variable representing whether the
 * modal should open.
 * @param {User} user The meeting instance for which to display
 * the information of.
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<FormProps>
 *     & React.RefAttributes<HTMLDivElement>>}
 */
const MeetingCard = forwardRef<HTMLDivElement, MeetingCardProps>(({
  meeting,
  setOpen,
}: MeetingCardProps, ref) => {
  const {
    icon,
    title,
    id,
    description,
    start,
    end,
  }= meeting;
  const classes = useStyles();
  const {joinMeeting} = useContext(AppStateContext);
  const handleJoin = () => {
    joinMeeting(meeting.id.toString());
    setOpen(false);
  };
  return (
    <div className={classes.root} ref={ref}>
      <Card className={classes.card}>
        <div className={classes.cardDetails}>
          <IconButton
            size={'medium'}
            className={classes.closeButton}
            aria-label="cancel"
            onClick={()=> setOpen(false)}
          >
            <CancelIcon fontSize={'inherit'}/>
          </IconButton>
          <CardContent className={classes.cardContent}>
            <Typography component="h2" variant="h5" className={classes.title}>
              {toTitleCase(title)}
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className={classes.start}
            >
              <span className={classes.descriptor}>
                  Starts
              </span>
              {toLocalStringMonth(start)}
            </Typography>
            <Chip
              className={clsx(classes.duration, {
                [classes.iconOffset]: icon,
              })}
              size="small"
              label={`${getTimeDiffMinutes(start, end)} Min`}
              icon={<QueryBuilderIcon />}
            />
            <Typography variant="subtitle1" paragraph>
              {description}
            </Typography>
          </CardContent>
          <Button
            id='join-meeting-button'
            className={classes.button}
            variant={'contained'}
            color={'primary'}
            onClick={handleJoin}
          >
              Join Meeting
          </Button>
          <AvatarGroup
            className={clsx(classes.users, {
              [classes.iconOffset]: icon,
            })}
            max={5}
            spacing={'small'}
            classes={{avatar: classes.avatar}}
          >
            {demoUsers.map((user, index) => (
              <UserAvatar
                key={index}
                user={user}
                avatarSize={4}
              />
            ))}
          </AvatarGroup>
        </div>
        {icon &&
                <CardMedia
                  className={classes.cardMedia}
                  image={icon}
                  title={'Meeting Icon'}
                />
        }
      </Card>
    </div>
  );
});
MeetingCard.propTypes = {
  meeting: PropTypes.instanceOf(Meeting).isRequired,
};
MeetingCard.displayName = 'Meeting Card';

export default MeetingCard;

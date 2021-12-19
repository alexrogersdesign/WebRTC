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
import {getTimeDiffMinutes, toLocalStringMonth} from '../../util/timeHelper';
import {AppStateContext} from '../../context/AppStateContext';
import {demoUsers} from 'src/util/demoItems';
import UserAvatar from '../common/UserAvatar';
import {toTitleCase} from '../../util/helpers';
import {Chip} from '@material-ui/core';
import clsx from 'clsx';

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
    icon: {
      margin: theme.spacing(.25, .25, .25),
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
    },
    cardMedia: {
      width: mediaWidth,
    },
    cardContent: {
      // height: '100%',
    },
    descriptor: {
      fontWeight: 'bold',
      paddingRight: theme.spacing(1),
    },
    duration: {
      position: 'absolute',
      bottom: theme.spacing(1),
      right: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
    },
    users: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    iconOffset: {
      right: `calc(${mediaWidth}px + ${theme.spacing(1)}px)`,
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
          <CardContent className={classes.cardContent}>
            <Typography component="h2" variant="h5">
              {toTitleCase(title)}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
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

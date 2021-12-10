/* eslint-disable no-unused-vars */
// TODO fix issue where join meeting button moves on screen size change
import React, {useContext, forwardRef} from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {Column, Row, Item} from '@mui-treasury/components/flex';
import {Info, InfoSubtitle, InfoTitle} from '@mui-treasury/components/info';
import {useApexInfoStyles} from '@mui-treasury/styles/info/apex';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import CalendarTodayTwoToneIcon from '@material-ui/icons/CalendarTodayTwoTone';
import ScheduleTwoToneIcon from '@material-ui/icons/ScheduleTwoTone';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Meeting from '../../shared/classes/Meeting';
import CopyButtonIcon from '../common/CopyButtonIcon';
import PropTypes from 'prop-types';
import {ChildrenProps} from '../../shared/types';
import {getTimeDiffMinutes, toLocalStringMonth} from '../../util/timeHelper';
import {AppStateContext} from '../../context/AppStateContext';
import {demoUsers} from 'src/util/demoItems';
import UserAvatar from '../common/UserAvatar';
import {toTitleCase} from '../../util/helpers';

interface Props extends ChildrenProps{
    meeting: Meeting
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '50vh',
      width: '60vw',
      [theme.breakpoints.up('lg')]: {
        width: '40vw',
      },
      [theme.breakpoints.down('sm')]: {
        width: '80vw',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100vw',
      },
    },
    card: {
      boxShadow: theme.shadows[6],
      position: 'relative',
      borderRadius: 5,
      backgroundColor: theme.palette.neutral.main,
      transition: theme.transitions.create(['width', 'height'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.complex,
      }),
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 5,
    },
    itemDisplay: {
      display: 'inline-flex',
      // flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
      padding: theme.spacing(0, .5, 0),
      backgroundColor: theme.palette.grey['400'],
      borderRadius: 3,
      border: `1px solid ${theme.palette.grey['500']}`,
      margin: theme.spacing(1.2),
    },
    description: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1),
      height: '100%',
      backgroundColor: theme.palette.neutral.main,
    },
    button: {
      border: `1px solid ${theme.palette.primary.dark}`,
    },
    icon: {
      margin: theme.spacing(.25, .25, .25),
    },
    avatar: {
      fontSize: '0.875rem',
      // backgroundColor: '#6d7efc',
    },
    delete: {
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
    title: {
      padding: theme.spacing(0, 1, 0),
    },

  }),
);
/**
 * Displays a meeting in card form.
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<Props>
 *     & React.RefAttributes<HTMLDivElement>>}
 */
const MeetingCard = forwardRef<HTMLDivElement, Props>(({
  meeting,
}: Props, ref) => {
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
  return (
    <div className={classes.root} ref={ref}>
      <Column className={classes.card}>
        <Row p={2} gap={1}>
          {icon?.length !== 0 && (
            <Avatar
              className={classes.logo}
              variant={'rounded'}
              src={icon}
            />
          )}
          <Info
            className={classes.title}
            position={'middle'}
            useStyles={useApexInfoStyles}
          >
            <InfoTitle>{toTitleCase(title)}</InfoTitle>
            <InfoSubtitle>{`ID: ${id}`}</InfoSubtitle>
          </Info>
          <CopyButtonIcon
            tooltipPlacement={'right-end'}
            textToCopy={id.toString()}
            description={'Meeting ID'}
            edge='end'
          />
        </Row>
        <Box
          pb={1}
          px={3}
          color="text.primary"
        >
          <Paper
            className={classes.itemDisplay}
            elevation={0}
          >
            <CalendarTodayTwoToneIcon
              fontSize={'small'}
              className={classes.icon}
            />
            <Typography
              align={'justify'}
              variant={'caption'}
              color={'textPrimary'}
            >
              {toLocalStringMonth(start)}
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            className={classes.itemDisplay}
          >
            <ScheduleTwoToneIcon
              fontSize={'small'}
              className={classes.icon}
            />
            <Typography
              variant={'caption'}
              color={'textPrimary'}
            >
              {`${getTimeDiffMinutes(start, end)} Minutes`}
            </Typography>
          </Paper>
        </Box>
        <Box
          pb={1}
          px={4}
          color={'grey.600'}
          fontSize={'0.875rem'}
        >
          <Typography
            variant={'subtitle2'}
            color={'textPrimary'}
          >
                Description
          </Typography>
          <Typography variant={'caption'} color ={'textSecondary'}>
            {description}
          </Typography>
          {/* </Paper>*/}
        </Box>
        <Row p={2} gap={2} position={'bottom'}>
          <Item>
            <AvatarGroup
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
          </Item>
          <Item position={'middle-right'}>
            <Button
              id='join-meeting-button'
              className={classes.button}
              variant={'contained'}
              color={'primary'}
              onClick={()=>joinMeeting(meeting.id.toString())}
            >
                Join Meeting
            </Button>
          </Item>
        </Row>
      </Column>
    </div>
  );
});
MeetingCard.propTypes = {
  meeting: PropTypes.instanceOf(Meeting).isRequired,
};
MeetingCard.displayName = 'Meeting Card';

export default MeetingCard;

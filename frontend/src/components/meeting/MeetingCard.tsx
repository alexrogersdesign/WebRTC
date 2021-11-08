/* eslint-disable no-unused-vars */
// TODO fix issue where join meeting button moves on screen size change
import React, {useEffect, useContext, forwardRef, Children} from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {Column, Row, Item} from '@mui-treasury/components/flex';
import {Info, InfoSubtitle, InfoTitle} from '@mui-treasury/components/info';
import {useApexInfoStyles} from '@mui-treasury/styles/info/apex';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import WebFont from 'webfontloader';
import CalendarTodayTwoToneIcon from '@material-ui/icons/CalendarTodayTwoTone';
import ScheduleTwoToneIcon from '@material-ui/icons/ScheduleTwoTone';

import Meeting from '../../shared/classes/Meeting';
import {SocketIOContext} from '../../context/SocketIOContext';
import CopyButtonIcon from '../common/CopyButtonIcon';
import PropTypes from 'prop-types';
import {ChildrenProps} from '../../shared/types';
import {getTimeDiffMinutes, toLocalStringMonth} from '../../util/formatTime';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';


interface Props extends ChildrenProps{
    meeting: Meeting
}
// eslint-disable-next-line max-len
const initialShadow = '0 4px 6px 2px rgba(0,0,0,0.08),' +
    ' 0px 2px 4px 0px rgba(0,0,0,0.24),' +
    ' inset 0 -3px 0 0 rgba(0,0,0,0.12)';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'height': '40%',
      'width': '60%',
      'position': 'relative',
    },
    card: {
      zIndex: 1,
      boxShadow: theme.shadows[6],
      position: 'relative',
      borderRadius: 5,
      backgroundColor: theme.palette.neutral.main,
      transition: '0.1s',
      height: '100%',
      border: '1px solid #000',
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 5,
    },
    itemDisplay: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: theme.spacing(0, .5, 0),
      backgroundColor: theme.palette.neutralGray.light,
      borderRadius: 3,
      border: `1px solid ${theme.palette.neutralGray.main}`,
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
      fontFamily: 'Ubuntu',
      fontSize: '0.875rem',
      backgroundColor: '#6d7efc',
    },
    delete: {
      // padding: theme.spacing(0, 70, 0),
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
    },
    title: {
      padding: theme.spacing(0, 1, 0),
    },
    copyButton: {
      // position: 'absolute',
      // right: '0',
    },
  }),
);

const MeetingCard = forwardRef<HTMLDivElement, Props>(
    ({meeting}: Props, ref) => {
      useEffect(() => {
        WebFont.load({
          google: {
            families: ['Ubuntu: 400,700'],
          },
        });
      }, [] );
      const {
        icon,
        title,
        id,
        description,
        start,
        end,
      }= meeting;
      const classes = useStyles();
      const {joinMeeting} = useContext(SocketIOContext);
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
                <InfoTitle>{title}</InfoTitle>
                <InfoSubtitle>{`ID: ${id}`}</InfoSubtitle>
              </Info>
              <CopyButtonIcon
                tooltipPlacement={'right-end'}
                textToCopy={id.toString()}
                description={'Meeting ID'}
                edge='end'
                className={classes.copyButton}
              />
            </Row>
            <Box
              pb={1}
              px={3}
              color="text.primary"
              fontSize={'0.675rem'}
              fontFamily={'Ubuntu'}
            >
              <Paper
                className={classes.itemDisplay}
                // variant={'outlined'}
                // elevation={1}
              >
                <CalendarTodayTwoToneIcon
                  fontSize={'small'}
                  className={classes.icon}
                />
                <Typography variant={'caption'}>
                  {'Start:  '}
                </Typography>
                <Typography
                  variant={'caption'}
                  color={'textPrimary'}
                >
                  {toLocalStringMonth(start)}
                </Typography>
              </Paper>
              <Paper
                // variant={'outlined'}
                elevation={1}
                className={classes.itemDisplay}
              >
                <ScheduleTwoToneIcon
                  fontSize={'small'}
                  className={classes.icon}
                />
                <Typography variant={'caption'}>
                  {'Duration:  '}
                </Typography>
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
              fontFamily={'Ubuntu'}
            >
              {/* <Paper*/}
              {/*  className={classes.description}*/}
              {/* >*/}
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
                <AvatarGroup max={4} classes={{avatar: classes.avatar}}>
                  {new Array(5).fill(0).map((_, index) => (
                    <Avatar
                      key={index}
                      src={`https://i.pravatar.cc/300?img=${Math.floor(
                          Math.random() * 30,
                      )}`}
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

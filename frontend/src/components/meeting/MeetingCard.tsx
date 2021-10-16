/* eslint-disable no-unused-vars */
// TODO fix issue where join meeting button moves on screen size change
import React, {useEffect, useContext, forwardRef, Children} from 'react';
// import GoogleFontLoader from 'react-google-font-loader';
import NoSsr from '@material-ui/core/NoSsr';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Column, Row, Item} from '@mui-treasury/components/flex';
import {Info, InfoSubtitle, InfoTitle} from '@mui-treasury/components/info';
import {useApexInfoStyles} from '@mui-treasury/styles/info/apex';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import WebFont from 'webfontloader';


import Meeting from '../../shared/classes/Meeting';
import {RestContext} from '../../context/rest/RestContext';
import {SocketIOContext} from '../../context/SocketIOContext';
import CopyButtonIcon from '../common/CopyButtonIcon';
import PropTypes from 'prop-types';
import {ChildrenProps} from '../../shared/types';


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
      'height': '30%',
      'width': '60%',
      'position': 'relative',
    },
    card: {
      zIndex: 1,
      boxShadow: theme.shadows[5],
      position: 'relative',
      borderRadius: 5,
      // boxShadow: '0 6px 20px 0 #dbdbe8',
      backgroundColor: '#fff',
      transition: '0.4s',
      height: '100%',
      border: '2px solid #000',
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 5,
    },
    avatar: {
      fontFamily: 'Ubuntu',
      fontSize: '0.875rem',
      backgroundColor: '#6d7efc',
    },
    join: {
      // 'background': 'linear-gradient(to top, #638ef0, #82e7fe)',
      // '& > *': {
      //   textTransform: 'none !important',
      // },
    },
    delete: {
      // padding: theme.spacing(0, 70, 0),
      alignSelf: 'flex-start',
      color: '#f44336',
      fill: '#f44336',
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
      }= meeting;
      const classes = useStyles();
      const {joinMeeting} = useContext(SocketIOContext);
      return (
        <div className={classes.root} ref={ref}>
          <Column className={classes.card}>
            <Row p={2} gap={2}>
              {/* <CardHeader>*/}
              {icon?.length !== 0 && (
                <Avatar
                  className={classes.logo}
                  variant={'rounded'}
                  src={icon}
                />
              )}
              <Info position={'middle'} useStyles={useApexInfoStyles}>
                <InfoTitle>{title}</InfoTitle>
                <InfoSubtitle>{`ID: ${id}`}</InfoSubtitle>
              </Info>
              <CopyButtonIcon
                textToCopy={id.toString()}
                description={'Meeting ID'}
                edge='end'
                className={classes.copyButton}
              />
              {/* </CardHeader>*/}
            </Row>
            <Box
              pb={1}
              px={2}
              color={'grey.600'}
              fontSize={'0.875rem'}
              fontFamily={'Ubuntu'}
            >
              {description}
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
                  className={classes.join}
                  // classes={btnStyles}
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

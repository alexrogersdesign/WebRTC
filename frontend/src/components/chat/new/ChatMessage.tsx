/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Message from '../../../shared/classes/Message';
import UserAvatar from '../../common/UserAvatar';
import {RestContext} from '../../../context/RestContext';
import {getMessageTimeDifference} from '../../../util/timeHelper';

interface StyleProps {
  incoming?: boolean
  first?: boolean,
  last?: boolean,
}
const bubbleRadius = 2;
const useStyles = makeStyles<Theme, StyleProps>((theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    avatar: {
      marginTop: 'auto',
      marginBottom: 'auto',
      zIndex: 5,
    },
    messageWrapper: ({incoming}) => ({
      position: 'relative',
      margin: theme.spacing(1, 1),
      // display: 'flex',
      // justifyContent: 'center',
      // justifyItems: 'center',
      textAlign: incoming? 'left': 'right',
      flexDirection: incoming? 'row' : 'row-reverse',
      marginLeft: incoming? 'auto' : undefined,
      marginRight: !incoming? 'auto' : undefined,
    }),
    message: ({incoming, last}) => {
      const backgroundColor = incoming?
        theme.palette.grey[200]:
        theme.palette.primary.dark;
      return ({
        'zIndex': 1,
        'minHeight': 38,
        'minWidth': 50,
        'padding': theme.spacing(1.5, 2),
        'marginLeft': incoming? theme.spacing(1): undefined,
        'borderRadius': 3,
        'borderTopRightRadius': theme.spacing(bubbleRadius),
        'borderTopLeftRadius': theme.spacing(bubbleRadius),
        'borderBottomRightRadius': incoming || last?
          theme.spacing(bubbleRadius) :
          3,
        'borderBottomLeftRadius': !incoming || last?
          theme.spacing(bubbleRadius) :
          3,
        backgroundColor,
        'color': theme.palette.getContrastText(backgroundColor),
        'fontSize': 12,
        '&:before, &:after': {
          content: '\'\'',
          position: 'absolute',
          bottom: 0,
          height: 25,
          zIndex: 0,
        },
        '&:before': {
          right: !incoming? -7: undefined,
          left: incoming? 3: undefined,
          width: 18,
          height: 20,
          bottom: 0,
          backgroundColor: backgroundColor,
          borderBottomLeftRadius: !incoming? 3 : undefined,
          borderBottomRightRadius: incoming? 3 : undefined,
        },
        '&:after': {
          right: !incoming? -18 : undefined,
          left: incoming? -9: undefined,
          width: 18,
          bottom: -6,
          height: 30,
          backgroundColor: theme.palette.grey[50],
          borderBottomLeftRadius: !incoming? 18 : undefined,
          borderBottomRightRadius: incoming? 18 : undefined,
        },

      });
    },
    infoText: ({incoming}) => ({
      fontWeight: 500,
      color: theme.palette.grey[600],
      fontSize: 9,
    }),
    date: {
      display: 'block',
      float: 'right',
    },
    user: {
      display: 'block',
      float: 'left',
    },
    alignment: ({incoming}) =>({
      display: 'flex',
      flexDirection: 'row',
      justifyContent: !incoming? 'flex-end' : 'flex-start',
    }),
  }),
);

interface Props {
  message: Message,
}

/**
 * A component that renders a chat message as either an incoming
 * message (left justified) or outgoing message (right justified).
 * @param {Message} message The message to display.
 * @return {JSX.Element}
 * @constructor
 */
const ChatMessage = ( {message}: Props) => {
  const timeToDisplay = getMessageTimeDifference(message);
  const {currentUser} = useContext(RestContext);
  const incoming = message.user.id.toString() !== currentUser?.id.toString();
  const classes = useStyles({incoming});

  return (
    <div className={classes.root} >
      <div className={classes.alignment}>
        {incoming &&
          <UserAvatar
            tooltipDisabled
            className={classes.avatar}
            user={message.user}
            avatarSize={5}
          />
        }
        <div>
          <div className={classes.messageWrapper}>
            <Typography
              align={'center'}
              className={classes.message}
              variant={'body2'}
            >
              {message.contents}
            </Typography>
          </div>
        </div>
      </div>
      <Typography
        className={classes.infoText}
        variant={'caption'}
      >
        {incoming &&
            <span className={classes.user}>{message.user.fullName}</span>
        }
        <span className={classes.date}>{timeToDisplay}</span>
      </Typography>
    </div>
  );
};

export default ChatMessage;

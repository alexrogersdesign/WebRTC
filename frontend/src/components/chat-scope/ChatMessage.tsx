/* eslint-disable no-unused-vars */
// TODO add image functionality
import React, {useContext} from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Message as ChatScopeMessage} from '@chatscope/chat-ui-kit-react';
import Message from '../../shared/classes/Message';
import UserAvatar from '../common/UserAvatar';
import {RestContext} from '../../context/rest/RestContext';

const size = 30;
const useStyles = makeStyles(({palette, spacing}) =>
  createStyles({
    // if you want the same as facebook messenger, use this color '#09f'
    avatar: {
      width: size,
      height: size,
    },
    rightRow: {
      marginLeft: 'auto',
    },
    leftRow: {
      marginRight: 'auto',
    },
    msgBox: {
      // 'width': '100%',
      // 'height': '100%',
      'paddingTop': '2%',
      'paddingLeft': '5%',
      'display': 'flex',
      'flexDirection': 'column',
      'alignItems': 'right',
      'marginBottom': 4,
      '&:hover $iconBtn': {
        opacity: 1,
      },
    },
    leftMsgBox: {
      textAlign: 'left',
    },
    rightMsgBox: {
      textAlign: 'right',
      flexDirection: 'row-reverse',
    },
    msg: {
      minHeight: '100%',
      // maxWidth: '100%',
      // minWidth: '60%',
      padding: spacing(1, 2),
      borderRadius: 4,
      // display: 'inline-block',
      wordBreak: 'break-word',
      fontFamily:
      // eslint-disable-next-line max-len
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fontSize: '14px',
    },
    left: {
      borderTopRightRadius: spacing(2.5),
      borderBottomRightRadius: spacing(2.5),
      backgroundColor: palette.grey[100],
    },
    right: {
      borderTopLeftRadius: spacing(2.5),
      borderBottomLeftRadius: spacing(2.5),
      backgroundColor: palette.primary.main,
      color: palette.common.white,
    },
    leftFirst: {
      borderTopLeftRadius: spacing(2.5),
    },
    leftLast: {
      borderBottomLeftRadius: spacing(2.5),
    },
    rightFirst: {
      borderTopRightRadius: spacing(2.5),
    },
    rightLast: {
      borderBottomRightRadius: spacing(2.5),
    },
    iconBtn: {
      'opacity': 0,
      'padding': 6,
      'color': 'rgba(0,0,0,0.34)',
      '&:hover': {
        color: 'rgba(0,0,0,0.87)',
      },
      'margin': '0 4px',
      '& svg': {
        fontSize: 20,
      },
    },
    image: {
      maxWidth: 120,
      maxHeight: 120,
    },
    date: {
      width: '100%',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.4)',
      margin: '12px 0',
      fontSize: 12,
      textAlign: 'center',
    },
    row: {

    },
    box: {
      flexGrow: 2,
      justifyContent: 'flex-start',
    },
  }),
);

interface Props {
    message: Message,
}


const ChatMessage = ( {message}: Props) => {
  // eslint-disable-next-line max-len
  const timeDiff = Math.floor((Date.now() - message.timeStamp.getTime()) / (60000));
  const midnight = new Date().setHours(0, 0, 0, 0);
  const beforeMidnight = midnight > message.timeStamp.getTime();
  let timeToDisplay = '';
  if (beforeMidnight) {
    timeToDisplay = message.timeStamp.toLocaleString([],
        {weekday: 'long', hour: '2-digit', minute: '2-digit'},
    );
  } else if (timeDiff === 0) timeToDisplay = 'now';
  else if (timeDiff ===1) timeToDisplay = `${timeDiff} minute ago`;
  else if (timeDiff < 60) timeToDisplay = `${timeDiff} minutes ago`;
  else if (timeDiff < 60 * 24) {
    timeToDisplay = message.timeStamp
        .toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  }

  const classes = useStyles();
  const {currentUser} = useContext(RestContext);

  const direction = message.user.id.toString() === currentUser?.id.toString() ?
        'outgoing':
        'incoming';

  return (
    <ChatScopeMessage model={{
      message: message.contents,
      sentTime: timeToDisplay,
      // sender: 'Emily',
      direction: direction,
      position: 'single',
    }}>
      <UserAvatar user={message.user}/>
      {/* @ts-ignore*/}
      <ChatMessage.Footer
        sender={message.user.fullName}
        sentTime={timeToDisplay}
      />
      <Typography>{message.user.fullName}</Typography>
      {/* <Avatar src={emilyIco} name={'Emily'} />*/}
    </ChatScopeMessage>
  );
};

export default ChatMessage;

/* eslint-disable no-unused-vars,max-len */
// TODO add ability to attach files and emotes
import React, {useContext} from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import {
  ChatContainer,
  MessageList,
  MessageInput,
  MainContainer,
  Message, Avatar, MessageSeparator,
} from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import {ChatContext} from '../../context/ChatContext';
import {Paper} from '@material-ui/core';
import {RestContext} from '../../context/rest/RestContext';
import {SocketIOContext} from '../../context/SocketIOContext';
import MessageClass from '../../shared/classes/Message';
import UserAvatar from '../common/UserAvatar';
import Typography from '@material-ui/core/Typography';
import {getMessageDirection} from '../../util/helpers';
import {getMessageTimeDifference} from '../../util/timeHelper';


interface Props {
    innerRef: React.MutableRefObject<any>
}
const useStyles = makeStyles(({palette, spacing}) =>
  createStyles({
    paper: {
      width: '100%',
      maxHeight: '50vw',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative',
    },
    container: {
      ...styles,
    },
    chatContainer: {
      width: '28vw',
      minHeight: 200,
    },
    message: {
      width: 'calc( 100% - 20px )',
      height: 'calc( 20% - 10px )',
    },
    messageText: {
      itemColor: palette.primary.dark,
    },
    avatarWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'stretch',
      alignItems: 'center',
      padding: spacing(0, 0, 0),
    },
    avatar: {
      padding: spacing(0, 1, 0),
    },
    input: {
      width: '90%',
      height: '90%',
      margin: spacing(.5, .5, .5),
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'stretch',
      alignItems: 'center',
    },
  }),
);

const ChatBox = ({innerRef}: Props) => {
  const classes = useStyles();
  const {messageList, sendMessage} = useContext(ChatContext);
  const {currentUser} = useContext(RestContext);
  const {meeting} = useContext(SocketIOContext);
  const handleSend = (contents:string) => {
    if (!currentUser) throw new Error('No user found');
    if (!meeting) throw new Error('Message sent outside of meeting');
    const message = new MessageClass(meeting.id, currentUser, contents);
    sendMessage(message);
  };

  const renderMessage = () => {
    if (messageList?.length === 0) {
      return <MessageSeparator>No Messages</MessageSeparator>;
    }
    return messageList?.map((message) => {
      if (!currentUser) throw new Error('currentUser is undefined');
      const direction = getMessageDirection(message, currentUser);
      const timeToDisplay = getMessageTimeDifference(message);
      return (
        <Message
          key={message.id.toString()}
          className={classes.message}
          model={{
            sentTime: timeToDisplay,
            direction: direction,
            position: 'single',
            type: 'custom',
          }}
          avatarPosition="tl"
        >
          <Message.TextContent className={classes.messageText}>
            <Typography
              variant='body2'
            >
              {message.contents}
            </Typography>
          </Message.TextContent>
          <Message.Header
            sender={message.user.fullName}
          />
          <Message.Footer
            sentTime={timeToDisplay}
          />
          {direction === 'incoming' && (
            <Avatar
              className={classes.avatarWrapper}
              size="fluid"
            >
              <UserAvatar avatarSize={4} user={message.user} className={classes.avatar}/>
            </Avatar>
          )}
        </Message>
      );
    });
  };
  return (
    <div
      className={classes.container}
      ref={innerRef}
    >
      <Paper className={classes.paper}>
        <MainContainer
          style={{fontSize: '1em'}}
          responsive
        >
          <ChatContainer className={classes.chatContainer}>
            <MessageList>
              {renderMessage()}
            </MessageList>
          </ChatContainer>
        </MainContainer>
        <MessageInput
          className={classes.input}
          autoFocus
          attachButton={false}
          onSend={handleSend}
          placeholder='Type a message...'
        />
      </Paper>
    </div>
  );
};

export default ChatBox;

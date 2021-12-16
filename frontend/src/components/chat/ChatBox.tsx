/* eslint-disable no-unused-vars,max-len */
// TODO add ability to attach files and emotes
import React, {useContext} from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import {
  ChatContainer,
  MessageList,
  MessageInput,
  MainContainer,
  Message as MessageElement, Avatar, MessageSeparator,
} from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import {ChatContext} from '../../context/ChatContext';
import {Paper} from '@material-ui/core';
import {RestContext} from '../../context/RestContext';
import Message from '../../shared/classes/Message';
import UserAvatar from '../common/UserAvatar';
import Typography from '@material-ui/core/Typography';
import {getMessageDirection} from '../../util/helpers';
import {getMessageTimeDifference} from '../../util/timeHelper';
import {ScrollToBottom} from '../common/ScrollToBottom';


interface Props {
    innerRef: React.MutableRefObject<any>
    isOpen: boolean
}
const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: '100%',
      maxHeight: '50vw',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative',
      zindex: 0,
    },
    container: {
      ...styles,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[0],
    },
    chatContainer: {
      width: '30vw',
      minHeight: 200,
    },
    message: {
      width: 'calc( 100% - 20px )',
      height: 'calc( 20% - 10px )',
    },
    messageText: {
      itemColor: theme.palette.primary.dark,
    },
    avatarWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'stretch',
      alignItems: 'center',
      padding: theme.spacing(0, 0, 0),
    },
    avatar: {
      padding: theme.spacing(0, 1, 0),
    },
    input: {
      width: '90%',
      height: '90%',
      margin: theme.spacing(.5, .5, .5),
    },
  }),
);

const ChatBox = ({innerRef, isOpen}: Props) => {
  const classes = useStyles();
  const {messageList, sendMessage} = useContext(ChatContext);
  const {currentUser, meeting} = useContext(RestContext);
  const handleSend = (contents:string) => {
    if (!meeting) throw new Error('Message sent outside of meeting');
    if (!currentUser) throw new Error('Attempted to send message when not logged in');
    const message = new Message(meeting.id, currentUser, contents);
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
        <MessageElement
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
          <MessageElement.TextContent className={classes.messageText}>
            <Typography
              variant='body2'
            >
              {message.contents}
            </Typography>
          </MessageElement.TextContent>
          <MessageElement.Header
            sender={message.user.fullName}
          />
          <MessageElement.Footer
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
        </MessageElement>
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
            <MessageList
            >
              {renderMessage()}
              <ScrollToBottom/>
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

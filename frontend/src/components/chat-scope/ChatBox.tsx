/* eslint-disable no-unused-vars */
// TODO add ability to attach files and emotes
import React, {useContext} from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import {
  TypingIndicator,
  ChatContainer,
  MessageSeparator,
  MessageList,
  MessageInput,
  MainContainer,
} from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';


import {ChatContext} from '../../context/ChatContext';
import ListItem from '@material-ui/core/ListItem';
import ChatMessage from './ChatMessage';


interface Props {
    innerRef: React.MutableRefObject<any>
}
const useStyles = makeStyles(({palette, spacing}) =>
  createStyles({
    paper: {
      // width: '35vw',
      width: '100%',
      height: '50vh',
      maxWidth: '500px',
      maxHeight: '700px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative',
    },
    paper2: {
      width: '80vw',
      maxWidth: '500px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative',
    },
    container: {
      // width: '100vw',
      height: '100vh',
      // display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    messagesBody: {
      // width: 'calc( 100% - 10px )',
      width: 'calc( 100%)',
      margin: 10,
      overflowY: 'scroll',
      height: 'calc( 100% - 80px )',
    },
    list: {
      width: '100%',
    },
    listItem: {
      width: '100%',
    },
  }),
);

const ChatBox = ({innerRef}: Props) => {
  const classes = useStyles();
  const {messageList} = useContext(ChatContext);
  const renderMessage = () => {
    return messageList?.map((message) => {
      return (
        // <ListItem
        //   className={classes.listItem}
        //   key={message.id.toString()}
        //   disableGutters
        // >
        <ChatMessage key={message.id.toString()} message={message}/>
        // </ListItem>
      );
    });
  };
  return (
    <div
      className={classes.container}
      // style={{height: '500px'}}
      ref={innerRef}
    >
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={<TypingIndicator content="Emily is typing" />}
          >
            {renderMessage()}
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatBox;

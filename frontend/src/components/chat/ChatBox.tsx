import React, {useContext} from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import {ChatContext} from '../../context/ChatContext';

import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import {ScrollToBottom} from '../common/ScrollToBottom';
interface Props {
  innerRef: React.MutableRefObject<any>
}
const outerBorderRadius = 5;
const innerPadding = 1;
const innerBorderRadius = outerBorderRadius - innerPadding;
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '30vw',
    },
    paper: {
      width: '100%',
      height: '50vh',
      maxWidth: '500px',
      maxHeight: '55vh',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: theme.palette.grey[400],
      borderRadius: outerBorderRadius,
      padding: innerPadding,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    list: {
      // width: '100%',
    },
    listItem: {
      width: '100%',
    },
    chatContainer: {
      display: 'flex',
      backgroundColor: theme.palette.grey[200],
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      borderRadius: innerBorderRadius,
      borderBottomRightRadius: 0,
    },
    chatWindow: {
      backgroundColor: theme.palette.grey[50],
      padding: theme.spacing(2),
      height: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      borderTopLeftRadius: innerBorderRadius,
      borderBottom: `1px solid ${theme.palette.grey[300]}`,

    },
  }),
);

/**
 * Renders the chat messages in a contained chatContainer with a
 * chat input field.
 * @param {React.MutableRefObject<any>} innerRef A ref to apply
 * to the root.
 * @return {JSX.Element}
 * @constructor
 */
const ChatBox = ({innerRef}: Props) => {
  const classes = useStyles();
  const {messageList} = useContext(ChatContext);

  const renderMessages = () => {
    return messageList?.map((message) => {
      return (
        <ListItem
          className={classes.listItem}
          key={message.id.toString()}
          disableGutters
        >
          <ChatMessage message={message}/>
        </ListItem>
      );
    });
  };
  return (
    <div className={classes.root} ref={innerRef}>
      <Paper className={classes.paper} elevation={0}>
        <div className={classes.chatContainer}>
          <div className={classes.chatWindow}>
            <List className={classes.list}>
              {(messageList && messageList?.length > 0) && renderMessages()}
              <ScrollToBottom/>
            </List>
          </div>
          <ChatInput />
        </div>
      </Paper>
    </div>
  );
};

export default ChatBox;

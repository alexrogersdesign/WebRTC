/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Message from '../../shared/classes/Message';
import User from '../../shared/classes/User';
import {ChatContext} from '../../context/ChatContext';

import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
interface Props {
  innerRef: React.MutableRefObject<any>
}
const useStyles = makeStyles(({palette, spacing}) =>
  createStyles({
    paper: {
      width: '35vw',
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

const testUser = new User('23341', 'Jack', 'Harvey');
const ChatBox = ({innerRef}: Props) => {
  const classes = useStyles();
  const {messageList} = useContext(ChatContext);

  const renderMessage = () => {
    return messageList?.map((message) => {
      return (
        <ListItem className={classes.listItem} key={message.id} disableGutters >
          <ChatMessage message={message}/>
        </ListItem>
      );
    });
  };
  return (
    <div className={classes.container} ref={innerRef}>
      <Paper className={classes.paper}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box p={3} height="100%" style={{overflowY: 'auto'}}>
            <List className={classes.list}>
              {messageList?.length && renderMessage()}
            </List>
          </Box>
          <ChatInput />
        </Box>
      </Paper>
    </div>
  );
};

export default ChatBox;

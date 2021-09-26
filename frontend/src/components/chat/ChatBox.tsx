/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import {Side, Message} from '../../shared/types';
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
      width: 'calc( 100% - 20px )',
      margin: 10,
      overflowY: 'scroll',
      height: 'calc( 100% - 80px )',
    },
  }),
);

const testUser = new User('23341', 'Jack', 'Harvey');
const testUser2 = new User('23342', 'Sally', 'Ride');
const testMessage:Message = {
  timeStamp: new Date(),
  user: testUser,
  contents: 'Test Message',
  id: '23341',
};
const testMessage2:Message = {
  timeStamp: new Date(),
  user: testUser,
  contents: 'Test Message',
  id: '23341',
};

const ChatBox = ({innerRef}: Props) => {
  const classes = useStyles();
  const {messageList} = useContext(ChatContext);
  return (
    <div className={classes.container} ref={innerRef}>
      <Paper className={classes.paper}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box p={3} height="100%" style={{overflowY: 'auto'}}>
            <ChatMessage user={testUser} side='right' message={testMessage}/>
            <ChatMessage user={testUser2} side='left' message={testMessage2}/>
            { messageList?.forEach((message) => {
              return (
                <ChatMessage user={testUser} message={message} side={'left'}/>
              );
            }) }
          </Box>
          <ChatInput />
        </Box>
      </Paper>
    </div>
  );
};

export default ChatBox;

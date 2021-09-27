/* eslint-disable no-unused-vars */
import React, {useContext, useState} from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import {Box, InputBase, IconButton} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
// import AddCircle from '@material-ui/icons/AddCircle';
// import Gif from '@material-ui/icons/Gif';
// import Image from '@material-ui/icons/Image';
// import Note from '@material-ui/icons/Note';
// import ThumbUp from '@material-ui/icons/ThumbUp';
import TagFaces from '@material-ui/icons/TagFaces';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';

import {ChatContext} from '../../context/ChatContext';
import Message from '../../shared/classes/Message';
import {SocketIOContext} from '../../context/SocketIOContext';


const useStyles = makeStyles(() =>
  createStyles({
    input: {
      flex: 'auto',
      borderRadius: 40,
      paddingLeft: 16,
      backgroundColor: 'rgba(0,0,0,0.04)',
      margin: '0 8px',
      height: 36,
      fontSize: 13,
    },
    icon: {
    },
  }),
);

const ChatInput = () => {
  const classes = useStyles();
  const {sendMessage} = useContext(ChatContext);
  const {currentUser} = useContext(SocketIOContext);
  const [field, setField] = useState('');
  const handleSend = () => {
    if (!currentUser) throw new Error('No user found');
    const message = new Message(currentUser, field);
    sendMessage && sendMessage(message);
    setField('');
  };
  return (
    <Box display="flex" minHeight={70} alignItems="center" px={2}>
      <IconButton edge="start" color="inherit">
        <AttachFileIcon className={classes.icon} />
      </IconButton>

      <InputBase
        value={field}
        onChange={(e)=> setField(e.target.value)}
        className={classes.input}
        placeholder={'Type a message...'}
        startAdornment={
          <InputAdornment position={'start'}>
            <IconButton edge="start" color="inherit">
              <TagFaces />
            </IconButton>
          </InputAdornment>
        }
      />

      <IconButton
        edge="end"
        color="inherit"
        onClick={handleSend}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;

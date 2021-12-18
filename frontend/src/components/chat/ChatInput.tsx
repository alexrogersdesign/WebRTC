/* eslint-disable no-unused-vars */
import React, {useContext, useState} from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import {InputBase, ButtonBase} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import {alpha} from '@material-ui/core/styles/colorManipulator';

import {ChatContext} from '../../context/ChatContext';
import Message from '../../shared/classes/Message';
import {SocketIOContext} from '../../context/SocketIOContext';
import {RestContext} from '../../context/RestContext';


const useStyles = makeStyles((theme) =>
  createStyles({
    input: {
      width: '100%',
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0, 2),
      backgroundColor: 'white',
      height: '3em',
      fontSize: 12,
    },
    root: {
      display: 'flex',
      height: '4em',
      alignItems: 'center',
      padding: theme.spacing(0, 2),
    },
    send: {
      transform: 'scale(.8)',
      color: theme.palette.primary.dark,
      padding: theme.spacing(.5, 1.5),
      width: '15%',
      borderRadius: theme.shape.borderRadius,
    },
    icon: {
      '&:hover, &.Mui-focusVisible': {
        transform: 'scale(1.075)',
        filter: `drop-shadow(0 0 1rem `+
          `${alpha(theme.palette.primary.dark, .4)})`,
      },
    },
  }),
);

/**
 * Renders a chat input field and send button which is hooked up to the
 * Rest API context.
 * @return {JSX.Element}
 * @constructor
 */
const ChatInput = () => {
  const classes = useStyles();
  const {sendMessage} = useContext(ChatContext);
  const {currentUser} = useContext(RestContext);
  const {meeting} = useContext(SocketIOContext);
  const [field, setField] = useState('');
  const handleSend = () => {
    if (!currentUser) throw new Error('No user found');
    /** Prevent sending if string doesnt contain any characters */
    if (!field.replace(/\s/g, '').length ) return;
    if (!meeting) throw new Error('Message sent outside of meeting');
    const message = new Message(meeting.id, currentUser, field);
    sendMessage(message);
    setField('');
  };
  const handleKeypress =
    /** Allow enter keypress to trigger a send event */
    (event: React.KeyboardEvent) => {
      if (event?.code === 'Enter' || event?.code === 'NumpadEnter') {
        handleSend();
      }
    };
  return (
    <div className={classes.root}>
      <InputBase
        id={'message-input'}
        value={field}
        onChange={(e)=> setField(e.target.value)}
        onKeyPress={handleKeypress}
        className={classes.input}
        placeholder={'Type a message...'}
      />
      <ButtonBase
        id={'send-message'}
        className={classes.send}
        onClick={handleSend}
      >
        <SendIcon className={classes.icon} />
      </ButtonBase>
    </div>
  );
};


export default ChatInput;

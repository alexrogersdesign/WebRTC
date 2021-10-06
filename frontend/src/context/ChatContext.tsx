// eslint-disable-next-line no-unused-vars
import React, {createContext, useEffect, useState, useContext} from 'react';
import {useSnackbar} from 'notistack';

import {ChildrenProps, IChatContext} from '../shared/types';
import Message from '../shared/classes/Message';
import {IReceivedMessage, parseMessage} from '../util/classParser';
import {SocketIOContext} from './SocketIOContext';

const ChatContext = createContext<Partial<IChatContext>>({});


interface Props extends ChildrenProps {}

const ChatContextProvider : React.FC<Props> = ({children}) => {
  const {socket} = useContext(SocketIOContext);
  const {enqueueSnackbar} = useSnackbar();
  //* The array of messages in the chat
  const [messageList, setMessageList] = useState<Message[]>([]);

  useEffect(() => {
    setMessageListener();
  }, [socket]);

  /**
     * Listens for new user message event then...
     */
  const setMessageListener = () => {
    socket.on('ReceivedMessage', (receivedMessage:IReceivedMessage) => {
      console.log('ReceivedMessage', receivedMessage);
      const message = parseMessage(receivedMessage);
      setMessageList((prevState) => [...prevState, message]);
      enqueueSnackbar(`New message from ${message.user}`);
    });
  };
  const sendMessage = (message:Message) =>{
    socket.emit('SendMessage', message);
  };

  return (
    <ChatContext.Provider value={{messageList, sendMessage}}>
      {children}
    </ChatContext.Provider>
  );
};


export {ChatContextProvider, ChatContext};

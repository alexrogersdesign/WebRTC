import React, {createContext, useEffect, useState, useContext} from 'react';
import {useSnackbar} from 'notistack';

import {ChildrenProps} from '../shared/types';
import Message from '../shared/classes/Message';
import {IReceivedMessage, parseMessage} from '../util/classParser';
import {SocketIOContext} from './SocketIOContext';
import {RestContext} from './rest/RestContext';

/** The context that handles all of the chat implementation. */
const ChatContext = createContext<IChatContext>(undefined!);

/**
 * A context provider for ChatContext.
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const ChatContextProvider : React.FC<ChildrenProps> = ({children}) => {
  const {socket} = useContext(SocketIOContext);
  const {currentUser, meeting} = useContext(RestContext);
  const {enqueueSnackbar} = useSnackbar();
  //* The array of messages in the chat
  const [messageList, setMessageList] = useState<Message[]>([]);

  useEffect(() => {
    setMessageListener();
  }, [socket]);

  /* Reset message list when a new meeting is joined*/
  useEffect(() => {
    setMessageList([]);
  }, [meeting]);

  /**
     * Listens for new user message event then...
     */
  const setMessageListener = () => {
    socket.current
        ?.on('ReceivedMessage', (receivedMessage:IReceivedMessage) => {
          const message = parseMessage(receivedMessage);
          const userId = currentUser?.id.toString();
          setMessageList((prevState) => [...prevState, message]);
          if (message.user.id.toString() !== userId) {
            enqueueSnackbar(
                `New message from ${message.user}`,
                {key: 'new-message'},
            );
          }
        });
    socket.current
        ?.on('ExistingMessages', (receivedMessages:IReceivedMessage[]) => {
          // TODO allow for previous state to be persisted
          //  when messages are received in bulk
          const messages = receivedMessages.map((item) => parseMessage(item));
          setMessageList(messages);
        });
  };
  const sendMessage = (message:Message) =>{
    socket.current?.emit('SendMessage', message);
  };
  return (
    <ChatContext.Provider value={{messageList, sendMessage}} >
      {children}
    </ChatContext.Provider>
  );
};

export interface IChatContext {
  messageList: Message[],
  sendMessage: (message: Message) => void
}


ChatContext.displayName = 'Chat Context';

export {ChatContextProvider, ChatContext};

import React, {createContext, useEffect, useState, useContext} from 'react';
import {useSnackbar} from 'notistack';

import {ChildrenProps} from '../util/types';
import Message from '@webrtc/backend/dist/shared/classes/Message';
import {
  IReceivedMessage,
  parseMessage}
  from '@webrtc/backend/dist/shared/util/classParser';
import {SocketIOContext} from './SocketIOContext';
import {RestContext} from './RestContext';

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
  /** The array of messages in the chat */
  const [messageList, setMessageList] = useState<Message[]>([]);

  useEffect(() => {
    socket && setMessageListener();
  }, [socket]);

  /* Reset message list when a new meeting is joined*/
  useEffect(() => {
    setMessageList([]);
  }, [meeting]);

  /**
  * Adds event listeners to the socket connection to handle
  * incoming messages.
  */
  const setMessageListener = () => {
    /** An event that indicates a new message has been received. */
    socket
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
    /** An event that indicates existing messages have been sent.
         * This occurs when a user joins an existing meeting where
         * there are existing messages. The message list is replaced
         * with the received messages.*/
    socket
        ?.on('ExistingMessages', (receivedMessages:IReceivedMessage[]) => {
          const messages = receivedMessages.map((item) => parseMessage(item));
          setMessageList(messages);
        });
  };
    /**
     * Sends a message to the meeting chat.
     * @param {Message} message The Message object to send.
     */
  const sendMessage = (message:Message) =>{
    socket?.emit('SendMessage', message);
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

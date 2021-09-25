// eslint-disable-next-line no-unused-vars
import React, {createContext, useEffect, useState, useRef} from 'react';
import {useSnackbar} from 'notistack';
import {Socket} from 'socket.io-client';

import {ChildrenProps, IChatContext, Message} from '../shared/types';
import {DefaultEventsMap} from 'socket.io-client/build/typed-events';

const ChatContext = createContext<Partial<IChatContext>>({});


interface Props extends ChildrenProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

const ContextProvider : React.FC<Props> = ({socket}) => {
  const {enqueueSnackbar} = useSnackbar();
  //* The array of messages in the chat
  const [messageList, setMessageList] = useState<Message[]>([]);

  /**
     * Listens for new user message event then...
     */
  const setMessageListener = () => {
    socket.on('NewMessage', (message:Message) => {
      setMessageList((prevState) => [...prevState]);
      enqueueSnackbar(`New message from ${message.user}`);
    });
  };
  const sendMessage = (message:Message) =>{

  };

  return (
    <div>

    </div>
  );
};


export {ContextProvider, ChatContext};

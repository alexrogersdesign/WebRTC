/* eslint-disable no-unused-vars */
import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import {User, Side, Message} from '../../types';

import ChatMessage from './ChatMessage';
interface Props {

}
const useStyles = makeStyles(({palette, spacing}) =>
  createStyles({
  }),
);

const testUser:User = {
  id: '23341',
  firstName: 'John',
  lastName: 'Doe',
};

const testMessage:Message = {
  timeStamp: new Date(),
  user: testUser,
  contents: 'Test Message',
  id: '23341',

};

const ChatBox = (props: Props) => {
  const styles = useStyles();
  return (
    <div>
      <ChatMessage user={testUser} side ={'right'} messages={[testMessage]}/>
    </div>
  );
};

export default ChatBox;

/* eslint-disable no-unused-vars */
import React from 'react';
import {SnackbarProvider} from 'notistack';

import {ChildrenProps} from '../types';

interface Props extends ChildrenProps {

}

const NotificationProvider = ({children}: Props) => {
  return (
    <SnackbarProvider maxSnack={3} preventDuplicate>
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;

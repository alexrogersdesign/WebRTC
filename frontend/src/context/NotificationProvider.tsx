import React from 'react';
import {SnackbarProvider} from 'notistack';

import {ChildrenProps} from '../shared/types';

/**
 * Provides the notification context which allows
 * notifications to be called from within the application.
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const NotificationProvider = ({children}: ChildrenProps) => {
  return (
    <SnackbarProvider maxSnack={3} preventDuplicate>
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;

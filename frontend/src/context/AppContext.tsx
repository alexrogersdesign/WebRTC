import React from 'react';
import {SegmentationContextProvider} from './SegmentationContext';
import {ChatContextProvider} from './ChatContext';
import {RestContextProvider} from './rest/RestContext';
import {ChildrenProps} from '../shared/types';
import {SocketIOContextProvider} from './SocketIOContext';
import NotificationProvider from './NotificationProvider';
import CustomThemeProvider from './CustomThemeProvider';
import {MediaControlContextProvider} from './MediaControlContext';

interface Props extends ChildrenProps {};

const AppContext = ({children}: Props) => {
  return (
    <>
      <CustomThemeProvider>
        <NotificationProvider>
          <RestContextProvider>
            <MediaControlContextProvider>
              <SocketIOContextProvider>
                <SegmentationContextProvider>
                  <ChatContextProvider>
                    {children}
                  </ChatContextProvider>
                </SegmentationContextProvider>
              </SocketIOContextProvider>
            </MediaControlContextProvider>
          </RestContextProvider>
        </NotificationProvider>
      </CustomThemeProvider>
    </>
  );
};

export default AppContext;

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
          <MediaControlContextProvider>
            <SocketIOContextProvider>
              <SegmentationContextProvider>
                <ChatContextProvider>
                  <RestContextProvider>
                    {children}
                  </RestContextProvider>
                </ChatContextProvider>
              </SegmentationContextProvider>
            </SocketIOContextProvider>
          </MediaControlContextProvider>
        </NotificationProvider>
      </CustomThemeProvider>
    </>
  );
};

export default AppContext;

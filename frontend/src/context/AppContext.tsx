import React from 'react';
import {SegmentationContextProvider} from './SegmentationContext';
import {ChatContextProvider} from './ChatContext';
import {RestContextProvider} from './rest/RestContext';
import {ChildrenProps} from '../shared/types';
import {SocketIOContextProvider} from './SocketIOContext';
import NotificationProvider from './NotificationProvider';
import CustomThemeProvider from './CustomThemeProvider';
import {MediaControlContextProvider} from './MediaControlContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import {OptionsContextProvider} from './OptionsContext';
import {PeerConnectionContextProvider} from './PeerConnectionContext';
import {AppStateContextProvider} from './AppStateContext';

interface Props extends ChildrenProps {};

const AppContext = ({children}: Props) => {
  return (
    <>
      <OptionsContextProvider>
        <CustomThemeProvider>
          <NotificationProvider>
            <RestContextProvider>
              <MediaControlContextProvider>
                <PeerConnectionContextProvider>
                  <SocketIOContextProvider>
                    <SegmentationContextProvider>
                      <ChatContextProvider>
                        <AppStateContextProvider>
                          {children}
                        </AppStateContextProvider>
                      </ChatContextProvider>
                    </SegmentationContextProvider>
                  </SocketIOContextProvider>
                </PeerConnectionContextProvider>
              </MediaControlContextProvider>
            </RestContextProvider>
          </NotificationProvider>
        </CustomThemeProvider>
      </OptionsContextProvider>
      <CssBaseline/>
    </>
  );
};

export default AppContext;

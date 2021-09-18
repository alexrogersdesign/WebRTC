import '@fontsource/roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles';
import {BrowserRouter as Router} from 'react-router-dom';

import {ContextProvider} from './context/SocketIOContext.tsx';
import NotificationProvider from './context/NotificationProvider';
import theme from './theme';

ReactDOM.render(
    <Router>
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <ContextProvider>
            <CssBaseline/>
            <App />
          </ContextProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>,
    document.getElementById('root'),
);

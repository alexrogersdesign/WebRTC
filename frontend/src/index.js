import '@fontsource/roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from '@material-ui/core/CssBaseline';
// import {ThemeProvider} from '@material-ui/core/styles';
import CustomThemeProvider from './context/CustomThemeProvider';
import {BrowserRouter as Router} from 'react-router-dom';

import {ContextProvider} from './context/SocketIOContext.tsx';
import NotificationProvider from './context/NotificationProvider';
// import theme from './util/theme/theme';

ReactDOM.render(
    <Router>
      <CustomThemeProvider>
        <NotificationProvider>
          <ContextProvider>
            <CssBaseline/>
            <App />
          </ContextProvider>
        </NotificationProvider>
      </CustomThemeProvider>
    </Router>,
    document.getElementById('root'),
);

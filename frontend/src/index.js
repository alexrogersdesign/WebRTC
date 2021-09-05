import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles';

import {ContextProvider} from './context/SocketIOContext.tsx';
import theme from './theme';

ReactDOM.render(
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <App />
      </ThemeProvider>
    </ContextProvider>,
    document.getElementById('root'),
);

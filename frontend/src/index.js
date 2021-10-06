import '@fontsource/roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter as Router} from 'react-router-dom';

import AppContext from "./context/AppContext";

ReactDOM.render(
    <Router>
      <AppContext>
            <CssBaseline/>
            <App />
      </AppContext>
    </Router>,
    document.getElementById('root'),
);

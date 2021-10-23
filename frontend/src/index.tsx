import '@fontsource/roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';

import App from './App';
import AppContext from './context/AppContext';

ReactDOM.render(
    <Router>
      <AppContext>
        <App />
      </AppContext>
    </Router>,
    document.getElementById('root'),
);

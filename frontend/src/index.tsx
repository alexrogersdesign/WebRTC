import '@fontsource/roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';
import App from './App';
import ContextWrapper from './context/ContextWrapper';
const dsn = process.env.REACT_APP_SENTRY_DSN;
Sentry.init({
  dsn: dsn,
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}


ReactDOM.render(
    <Router>
      <ContextWrapper>
        <App />
      </ContextWrapper>
    </Router>
    ,
    document.getElementById('root'),
);

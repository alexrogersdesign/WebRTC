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


ReactDOM.render(
    // <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <Router>
      <ContextWrapper>
        <App />
      </ContextWrapper>
    </Router>
    // </Sentry.ErrorBoundary>,
    ,
    document.getElementById('root'),
);

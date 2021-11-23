import '@fontsource/roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';
import App from './App';
import AppContext from './context/AppContext';

Sentry.init({
  dsn: 'https://133b1497ddc747eb865ea5b8bb1e78bb@o1076451.ingest.sentry.io/6078281',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


ReactDOM.render(
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <Router>
        <AppContext>
          <App />
        </AppContext>
      </Router>
    </Sentry.ErrorBoundary>,
    document.getElementById('root'),
);


import React from 'react';
// import PropTypes from 'prop-types';
import {BrowserRouter as Router} from 'react-router-dom';

import Room from './components/Room';
/**
 * App
 * @return {React.Component}
 */
export default function App() {
  return (
    <Router>
      <Room/>
    </Router>
  );
}

App.propTypes = {
//   children: PropTypes.node;
};

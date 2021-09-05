
import React from 'react';
// import PropTypes from 'prop-types';
import {BrowserRouter as Router} from 'react-router-dom';
// import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import Room from './components/Room';
/**
 * App
 * @return {React.Component}
 */
export default function App() {
  return (
    <Box >
      <Router>
        <Room/>
      </Router>
    </Box>
  );
}

App.propTypes = {
//   children: PropTypes.node;
};


import React, {useEffect} from 'react';
import {io} from 'socket.io-client';
// import PropTypes from 'prop-types';
import {BrowserRouter as Router} from 'react-router-dom';

import Room from './components/Room';
const socket = io('http://localhost:5000');
/**
 * App
 * @return {React.Component}
 */
export default function App() {
  useEffect(() => {
    socket.on('CurrentUserID', (id) => console.log(id));
  }, []);
  return (
    <Router>
      <Room/>
    </Router>
  );
}

App.propTypes = {
//   children: PropTypes.node;
};

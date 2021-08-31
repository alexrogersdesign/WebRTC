
import React, {useEffect} from 'react';
import {io} from 'socket.io-client';
// import PropTypes from 'prop-types';

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
    <div>
       App
    </div>
  );
}

App.propTypes = {
//   children: PropTypes.node;
};

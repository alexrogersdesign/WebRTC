
import React from 'react';
// import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

import Room from './components/Room';
/**
 * App
 * @return {JSX.Element}
 */
export default function App() {
  return (
    <Box >
      <Room/>
    </Box>
  );
}

App.propTypes = {
//   children: PropTypes.node;
};

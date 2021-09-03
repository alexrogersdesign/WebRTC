import React, {useContext, useEffect} from 'react';
import VideoPlayer from './VideoPlayer';

import {SocketIOContext} from '../context/SocketIOContext';
interface Props {

}


const Room = (props: Props) => {
  // const socketInstance = useref(null);
  const {initializeConnection, endConnection} = useContext(SocketIOContext);
  useEffect(() => {
    initializeConnection && initializeConnection();
    return () => {
      endConnection && endConnection();
    };
  }, []);
  return (
    <div>
      <VideoPlayer/>
    </div>
  );
};

export default Room;

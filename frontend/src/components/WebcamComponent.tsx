import React from 'react';
import Webcam from 'react-webcam';
interface Props {

}
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};
const WebcamComponent = (props: Props) => {
  return (
    <Webcam videoConstraints={videoConstraints}/>
  );
};


export default WebcamComponent;

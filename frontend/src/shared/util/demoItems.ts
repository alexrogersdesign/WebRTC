// import User from '@webrtc/frontend/classes/User';
import User from '../classes/User';
import iconA from './files/img/user-a-icon.jpeg';
import iconB from './files/img/user-b-icon.jpeg';
import iconC from './files/img/user-c-icon.jpeg';
import iconD from './files/img/user-d-icon.jpeg';
import videoASrc from './files/video/VideoG.mp4';
import videoBSrc from './files/video/VideoB.mp4';
import videoCSrc from './files/video/VideoC.mp4';
import videoDSrc from './files/video/VideoH.mp4';
import videoESrc from './files/video/VideoE.mp4';
import videoFSrc from './files/video/VideoF.mp4';

const userA = new User('Jarrod', 'Carroll', 'jcarroll@gmail.com');
const userB = new User('Kristina', 'Abernathy', 'kabernathy@gmail.com');
const userC = new User('Hilma', 'Schinner', 'hachinner@gmail.com');
const userD = new User('Roslyn', 'Satterfield', 'rsatterfield@gmail.com');
const userE = new User('Eda', 'Kling', 'ekling@gmail.com');
const userF = new User('Joan', 'Green', 'jgreen@gmail.com');
userA.icon = iconA.toString();
userB.icon = iconB.toString();
userE.icon = iconC.toString();
userD.icon = iconD.toString();


export const demoUsers = [userA, userB, userC, userD, userE, userF];

export const demoVideoFiles = [
  videoASrc, videoBSrc, videoCSrc, videoDSrc, videoESrc, videoFSrc,
];

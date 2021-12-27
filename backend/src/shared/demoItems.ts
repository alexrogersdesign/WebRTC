import ObjectID from 'bson-objectid';

import User from './classes/User.js';

import iconA from './util/files/img/user-a-icon.jpeg';
import iconB from './util/files/img/user-b-icon.jpeg';
import iconC from './util/files/img/user-c-icon.jpeg';
import iconD from './util/files/img/user-d-icon.jpeg';
import videoASrc from './util/files/video/VideoG.mp4';
import videoBSrc from './util/files/video/VideoB.mp4';
import videoCSrc from './util/files/video/VideoC.mp4';
import videoDSrc from './util/files/video/VideoH.mp4';
import videoESrc from './util/files/video/VideoE.mp4';
import videoFSrc from './util/files/video/VideoF.mp4';

const userA = new User('Jarrod', 'Carroll', 'jcarroll@gmail.com', new ObjectID('61c8d9759f71fa8fb70aeef8'));
const userB = new User('Kristina', 'Abernathy', 'kabernathy@gmail.com', new ObjectID('61c8d9c8db5ec9eaae52d6c8'));
const userC = new User('Hilma', 'Schinner', 'hachinner@gmail.com', new ObjectID('61c8d9d860c5067dbcd8f17a'));
const userD = new User('Roslyn', 'Satterfield', 'rsatterfield@gmail.com', new ObjectID('61c9e5e1bd90617a18b7a039'));
const userE = new User('Eda', 'Kling', 'ekling@gmail.com', new ObjectID('61c8d9e65ad697d6e9f12932'));
const userF = new User('Joan', 'Green', 'jgreen@gmail.com', new ObjectID('61c8d9eb494c5f6b35420e37'));
userA.icon = iconA.toString();
userB.icon = iconB.toString();
userE.icon = iconC.toString();
userD.icon = iconD.toString();


export const demoUsers = [userA, userB, userC, userD, userE, userF];

export const demoVideoFiles = [
  videoASrc, videoBSrc, videoCSrc, videoDSrc, videoESrc, videoFSrc,
];

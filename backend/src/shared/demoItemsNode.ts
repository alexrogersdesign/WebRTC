import User from './classes/User.js';
import fs from 'fs';
import ObjectID from 'bson-objectid';


const iconA = fs.readFileSync('./dist/shared/util/files/img/user-a-icon.jpeg', {encoding: 'base64'});
const iconB = fs.readFileSync('./dist/shared/util/files/img/user-b-icon.jpeg', {encoding: 'base64'});
const iconC = fs.readFileSync('./dist/shared/util/files/img/user-c-icon.jpeg', {encoding: 'base64'});
const iconD = fs.readFileSync('./dist/shared/util/files/img/user-d-icon.jpeg', {encoding: 'base64'});


const userA = new User('Jarrod', 'Carroll', 'jcarroll@gmail.com', new ObjectID('61c8d9759f71fa8fb70aeef8'));
const userB = new User('Kristina', 'Abernathy', 'kabernathy@gmail.com', new ObjectID('61c8d9c8db5ec9eaae52d6c8'));
const userC = new User('Hilma', 'Schinner', 'hachinner@gmail.com', new ObjectID('61c8d9d860c5067dbcd8f17a'));
const userD = new User('Roslyn', 'Satterfield', 'rsatterfield@gmail.com', new ObjectID('61c9e5e1bd90617a18b7a039'));
const userE = new User('Eda', 'Kling', 'ekling@gmail.com', new ObjectID('61c8d9e65ad697d6e9f12932'));
const userF = new User('Joan', 'Green', 'jgreen@gmail.com', new ObjectID('61c8d9eb494c5f6b35420e37'));

userA.icon = iconA
userB.icon = iconB
userE.icon = iconC
userD.icon = iconD


export const demoUsers = [userA, userB, userC, userD, userE, userF];

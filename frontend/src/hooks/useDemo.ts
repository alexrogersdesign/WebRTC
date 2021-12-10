import videoASrc from '../util/files/video/VideoG.mp4';
import videoBSrc from '../util/files/video/VideoB.mp4';
import videoCSrc from '../util/files/video/VideoC.mp4';
import videoDSrc from '../util/files/video/VideoH.mp4';
import videoESrc from '../util/files/video/VideoE.mp4';
import videoFSrc from '../util/files/video/VideoF.mp4';
import iconA from '../util/files/img/user-a-icon.jpeg';
import iconB from '../util/files/img/user-b-icon.jpeg';
import iconC from '../util/files/img/user-c-icon.jpeg';
import iconD from '../util/files/img/user-d-icon.jpeg';
import {useEffect, useRef, useState} from 'react';
import User from '../shared/classes/User';
import {CallOption} from 'peerjs';

type AddUsers = (user:User, stream:MediaStream, data?:CallOption) => void;
type RemoveUsers = (id:string) => void

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

/**
 * A hook that implements fake "demo" users for testing or demonstration
 * purposes.
 * @param {AddUsers} add A function to supply the demo users to
 * @param {RemoveUsers} remove A function to remove the demo user as a
 * cleanup action.
 * @param {User[]} argUsers An optional array of Users to replace
 * the default users.
 * @param {string[]} argVideoFiles An optional array of video files
 * @return {UseDemoTuple}
 */
const useDemo = (
    add: AddUsers,
    remove: RemoveUsers,
    argUsers?: User[],
    argVideoFiles?: string[],
) => {
  const videos = useRef<HTMLVideoElement[]>([]);
  const demoUsers = useRef<User[]>([]);
  /**
   * @type {[Boolean, Function]} Demo
   */
  const [demo, setDemo] = useState(false);

  /** Show dummy streams if demo is enabled, else
   * clean up streams */
  useEffect(() => {
    if (!demo) {
      return removeDemoUsers(demoUsers.current);
    }
    createDemoUsers().then((users) => demoUsers.current = users);
    return () => removeDemoUsers(demoUsers.current);
  }, [demo]);

  /**
   * Cleans up dummy streams.
   * @param {User[]} users An array of the dummy users
   * to clean up.
   */
  const removeDemoUsers = (users: User[]) => {
    users?.forEach((user)=> remove(user.id.toString()));
  };
  /**
   * Starts the demo process.
   * @return {void}
   */
  const startDemo = () => setDemo(true);
  /**
   * Ends the demo process.
   * @return {void}
   */
  const stopDemo = () => setDemo(false);
  /**
   * Creates the demo users and adds via the AddUsers function.
   * @return {Promise<User[]>}
   */
  const createDemoUsers = async () => {
    const users = argUsers?? [userA, userB, userC, userD, userE, userF];
    const videoFiles = argVideoFiles?? [
      videoASrc, videoBSrc, videoCSrc, videoDSrc, videoESrc, videoFSrc,
    ];
    /** Create HTMLVideoElements to convert the file string into a MediaStream
     * element. */
    users.forEach(() => videos.current.push(document.createElement('video')));
    /** Loops through the videos array, for each element the video
     * is setup and the MediaStream is captured.  */
    videos.current.forEach((video, index) =>{
      if (typeof users[index] === 'undefined') return;
      if (typeof videoFiles[index] === 'undefined') return;
      video.src = videoFiles[index];
      video.load();
      video.autoplay = true;
      video.loop = true;
      /** Add the users and media streams  */
      add(users[index], (video as any).captureStream());
    });
    return users;
  };
  const useDemoTuple: UseDemoTuple = [startDemo, stopDemo, demo] as const;
  return useDemoTuple;
};

type UseDemoTuple = readonly [
  startDemo: () => void,
  stopDemo: () => void,
  demo: boolean
]

export {useDemo};


import {useEffect, useRef, useState} from 'react';
import User from '../shared/classes/User';
import {CallOption} from 'peerjs';
import {demoUsers, demoVideoFiles} from '../util/demoItems';

type AddUsers = (user:User, stream:MediaStream, data?:CallOption) => void;
type RemoveUsers = (id:string) => void


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
  const createdUsers = useRef<User[]>([]);
  /**
   * @type {[Boolean, Function]} Demo
   */
  const [demo, setDemo] = useState(false);

  /** Show dummy streams if demo is enabled, else
   * clean up streams */
  useEffect(() => {
    if (!demo) {
      return removeDemoUsers(createdUsers.current);
    }
    createDemoUsers().then((users) => createdUsers.current = users);
    return () => removeDemoUsers(createdUsers.current);
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
    const users = argUsers?? demoUsers;
    const videoFiles = argVideoFiles?? demoVideoFiles;
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

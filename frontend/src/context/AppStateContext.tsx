// eslint-disable-next-line no-unused-vars
import React, {createContext, useContext, useEffect} from 'react';
import {useSnackbar} from 'notistack';

import {ChildrenProps} from '../shared/types';
import {SocketIOContext} from './SocketIOContext';
import {RestContext} from './rest/RestContext';
import {useNavigate} from 'react-router-dom';
import {PeerConnectionContext} from './PeerConnectionContext';
import {MediaControlContext} from './MediaControlContext';
import {AuthenticationError} from '../util/errors/AuthenticationError';

const AppStateContext = createContext<IAppStateContext>(undefined!);

/**
 * A context provider that handles the Application state.
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const AppStateContextProvider : React.FC<ChildrenProps> = ({children}) => {
  const {socketJoinMeeting, socketLeaveMeeting} = useContext(SocketIOContext);
  const {
    buildCallService,
    dismantleCallService,
  } = useContext(PeerConnectionContext);
  const {
    clearExternalMedia,
    initializeMediaStream,
    stopWebcamStream,
  } = useContext(MediaControlContext);
  const {
    setMeeting,
    findMeeting,
    checkIfLogged,
  } = useContext(RestContext);
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  /** The param extracted from the url indicating the current meeting.*/
  const roomParam = new URLSearchParams(window.location.search).get('room');

  /**
   * The cadence to be called on the application's first load.
   * @return {Promise<void>}
   */
  const firstLoadCadence = async () => {
    try {
      await checkIfLogged();
      roomParam && await joinMeeting(roomParam);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        enqueueSnackbar(error.message);
        navigate('');
      }
    }
  };
  useEffect(() => {
    firstLoadCadence();
  }, []);
  /**
     * Joins a new meeting.
     * Tells backend server that it would like to join the specified meeting
     * Pushes joined meeting to Url. Enables call service.
     * @param {string} newMeetingID the meeting to join
     */
  const joinMeeting = async (newMeetingID:string) => {
    const foundMeeting = await findMeeting(newMeetingID);
    if (!foundMeeting) throw new Error('Unable to find meeting');
    socketJoinMeeting(foundMeeting);
    setMeeting(foundMeeting);
    await initializeMediaStream();
    buildCallService();
    //* Push meeting to url parameter.
    navigate('?room='+ foundMeeting?.id);
    enqueueSnackbar(
        `Joining meeting ${foundMeeting.title}`,
        {variant: 'info'},
    );
  };
  /**
   * Calls the sequence of events to leave a meeting.
   */
  const leaveMeeting = () => {
    socketLeaveMeeting();
    enqueueSnackbar(`Leaving meeting`);
    setMeeting(null);
    stopWebcamStream();
    navigate('');
    clearExternalMedia();
    dismantleCallService();
  };


  return (
    <AppStateContext.Provider value={{joinMeeting, leaveMeeting}} >
      {children}
    </AppStateContext.Provider>
  );
};

export interface IAppStateContext {
   joinMeeting: (newMeetingID:string) => void
   leaveMeeting: () => void;
 }


AppStateContext.displayName = 'App State Context';

export {AppStateContextProvider, AppStateContext};

/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useSnackbar} from 'notistack';

import {ChildrenProps} from '../shared/types';
import {SocketIOContext} from './SocketIOContext';
import {ILoginCredentials, RestContext} from './RestContext';
import {useNavigate} from 'react-router-dom';
import {PeerConnectionContext} from './PeerConnectionContext';
import {MediaControlContext} from './MediaControlContext';
import {AuthenticationError} from '../util/errors/AuthenticationError';
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import User from '../shared/classes/User';

/**
 * The context that handles the application state changes
 */
const AppStateContext = createContext<IAppStateContext>(undefined!);

/**
 * A context provider that handles the Application state.
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const AppStateContextProvider : React.FC<ChildrenProps> = ({children}) => {
  const {
    socketJoinMeeting,
    socketLeaveMeeting,
    cleanupSocket,
  } = useContext(SocketIOContext);
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
    loginRequest,
    logoutRequest,
  } = useContext(RestContext);
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  /** The param extracted from the url indicating the current meeting.*/
  const roomParam = new URLSearchParams(window.location.search).get('room');

  const [attendeeDrawerOpen, setAttendeeDrawerOpen] = useState(false);
  const [videoDrawerOpen, setVideoDrawerOpen] = useState(false);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));


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
   * Calls on rest API to make a login request.
   * @param {ILoginCredentials} credentials The login credentials
   * @return {Promise<void>}
   */
  const login = async (credentials: ILoginCredentials) => {
    try {
      return await loginRequest(credentials);
    } catch (error) {
      error instanceof Error && console.error(error.message);
    }
  };
  /**
   * Calls on rest API to make a logout request
   * Cleans up socket connection.
   * @return {Promise<void>}
   */
  const logout = async () => {
    try {
      cleanupSocket();
      await logoutRequest();
    } catch (error) {
      error instanceof Error && console.error(error.message);
    }
  };

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
    <AppStateContext.Provider value={{
      login,
      logout,
      joinMeeting,
      leaveMeeting,
      attendeeDrawerOpen,
      setAttendeeDrawerOpen,
      videoDrawerOpen,
      setVideoDrawerOpen,
      xs,
      sm,
    }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export interface IAppStateContext {
   login: (credentials: ILoginCredentials) => Promise<User| undefined>,
   logout: () => Promise<void>,
   joinMeeting: (newMeetingID:string) => void
   leaveMeeting: () => void;
   attendeeDrawerOpen: boolean;
   setAttendeeDrawerOpen: Dispatch<SetStateAction<boolean>>;
   videoDrawerOpen: boolean;
   setVideoDrawerOpen: Dispatch<SetStateAction<boolean>>;
   xs: boolean;
   sm: boolean;
}


AppStateContext.displayName = 'App State Context';

export {AppStateContextProvider, AppStateContext};

// eslint-disable-next-line no-unused-vars
import React, {createContext, useContext, useEffect} from 'react';
import {useSnackbar} from 'notistack';

import {ChildrenProps} from '../shared/types';
import {SocketIOContext} from './SocketIOContext';
import {RestContext} from './rest/RestContext';
import {useNavigate} from 'react-router-dom';
import {PeerConnectionContext} from './PeerConnectionContext';
import {MediaControlContext} from './MediaControlContext';

const AppStateContext = createContext<IAppStateContext>(undefined!);


interface Props extends ChildrenProps {}

const AppStateContextProvider : React.FC<Props> = ({children}) => {
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
    currentUser,
    setMeeting,
    findMeeting,
  } = useContext(RestContext);
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  //* the param extracted from the url indicating the current meeting
  const roomParam = new URLSearchParams(window.location.search).get('room');


  /** If a URL param for a meeting to join is provided,
   * attempt to join the room */
  useEffect(() => {
    if (roomParam) {
      joinMeeting(roomParam);
    }
  }, []);

  /**
     * Joins a new meeting.
     * Tells backend server that it would like to join the specified meeting
     * Pushes joined meeting to Url. Enables call service.
     * @param {string} newMeetingID the meeting to join
     */
  const joinMeeting = async (newMeetingID:string) => {
    if (!currentUser) return navigate('');
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

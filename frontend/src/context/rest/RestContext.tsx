/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useEffect,
  useState,
} from 'react';
import {OptionsObject, useSnackbar} from 'notistack';
import ObjectID from 'bson-objectid';

import {ChildrenProps} from '../../shared/types';
import User from '../../shared/classes/User.js';
import {
  parseMeeting,
  // parseMeetingIcon,
  parseUser,
} from '../../util/classParser';
import Meeting from '../../shared/classes/Meeting';
import useLocalStorage from 'react-use-localstorage';
import {useRestApi} from './useRestApi';
import {MeetingIcon} from '../../shared/classes/MeetingIcon';

// const loginBaseUrl = process.env.LOGIN_BASE_URL || 'localhost:5000/forms';

const RestContext = createContext<IRestContext>(undefined!);

interface Props extends ChildrenProps{}

export interface ILoginCredentials {
  email: string,
  password: string
}
export interface INewUser {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  iconImage?: string,

}
export interface INewMeeting {
  title: string,
  description: string,
  start: Date,
  end: Date,
  iconImage?: string,
  attendees?: User[],
}

const RestContextProvider = ({children}: Props) => {
  // TODO check for cookie on refresh (persist login)
  // TODO logout across tabs (local storage logout key)
  const {enqueueSnackbar} = useSnackbar();
  const [loggedIn, setLoggedIn] = useState(false);
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const [logoutStorage, setLogoutStorage] = useLocalStorage('logout', '');

  const handleError = (error:any, message?: string) => {
    const newMessage = message?? error.message?? 'An error has occurred';
    if (error?.response?.status === 401) {
      enqueueSnackbar(newMessage, snackbarWarnOptions);
      console.log(JSON.stringify(error.stacktrace));
    } else if (error?.response?.status >= 500) {
      console.log(error.message);
    } else console.log(error.message);
    return;
  };
  const {
    api,
    token,
    setToken,
    currentUser,
    setCurrentUser,
    loginRequest,
    logoutRequest,
    refreshToken,
    findMeeting,
    getAllMeetingsRequest,
    deleteMeetingRequest,
  } = useRestApi(null, handleError);

  const checkIfLogged = async () => {
    try {
      /* Check if localstorage indicating a logout value is populated
         if an empty string is found, the user has not set the value */
      if (logoutStorage !== '') return;
      await refreshToken();
      setLoggedIn(true);
    } catch (err) {
      setLoggedIn(false);
      console.log('Not logged in');
    }
  };

  /**
   * Check if currently logged in on first load.
   */
  useEffect(() => {
    checkIfLogged();
  }, []);

  // /**
  //  * Updates the axios config parameters when token updates
  //  * Sets Logged to true
  //  */
  // useEffect(() => {
  //   if (token) setLoggedIn(true);
  //   else setLoggedIn(false);
  // }, [token]);

  /**
   * Communicates with the backend to login user
   * @param {ILoginCredentials} credentials and object containing the email
   * and password to login with.
   * Receives a token on successful login and stores it to react state
   * and local storage to be used throughout the application;
   * return {Promise<User | undefined>} A promise resolving to the
   * a user object reflecting the new logged in user or undefined
   * if the login was not successful.
   */
  // eslint-disable-next-line max-len
  const login = async (credentials: ILoginCredentials):Promise<User | undefined> => {
    const failedLoginMessage = 'Invalid Username or Password';
    try {
      const response = await loginRequest(credentials);
      const {token: receivedToken, user} = response;
      setToken(receivedToken);
      const parsedUser = parseUser(user);
      setCurrentUser(parsedUser);
      enqueueSnackbar(`Welcome ${parsedUser.fullName}`, snackbarSuccessOptions);
      setLogoutStorage('');
      setLoggedIn(true);
      return parsedUser;
    } catch (error) {
      handleError(error, failedLoginMessage);
    }
  };
  /**
   * Communicates with the backend to create a new user.
   * @param {INewUser} newUser An object containing the information required
   * to create a new user.
   * return {Promise<User | undefined>} A promise resolving to the
   * a user object reflecting the new created user or undefined
   * if the creation was not successful.
   */
  const createUser = async (newUser: INewUser):Promise<User | undefined> => {
    const {firstName, lastName, email, password, iconImage} = newUser;
    const newId = new ObjectID();
    const formData = new FormData();
    formData.append('id', newId.toString());
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('icon', iconImage?? '');
    const response = await api.post('users', formData)
        .catch((error) => handleError(error, 'Unable to create user'));
    if (!response) return;
    const user = response.data;
    const parsedUser = parseUser(user);
    enqueueSnackbar(
        `Account for ${parsedUser.email} created`,
        snackbarSuccessOptions);
    return parsedUser;
  };
  const sendMeetingIcon = async (image: String, meetingId:ObjectID) => {
    const icon = {
      id: new ObjectID(),
      image,
      meeting: meetingId,
    };
    return await api
        .post('meetings/icon', icon)
        .catch((error) => {
          handleError(error, 'Unable to add meeting icon');
        });
  };

  /**
   * Communicates with the backend to create a new meeting.
   * @param {INewMeeting} newMeeting An object containing the information
   * required to create a new meeting.
   * return {Promise<Meeting | undefined>} A promise resolving to the
   * a meeting object reflecting the new created meeting or undefined
   * if the creation was not successful.
   */
  // eslint-disable-next-line max-len
  const createMeeting = async (newMeeting: INewMeeting):Promise<Meeting | undefined> => {
    const {title, description, start, end, iconImage} = newMeeting;
    const newMeetingId = new ObjectID();
    const formData = new FormData();
    formData.append('id', newMeetingId.toString());
    formData.append('title', title);
    formData.append('description', description);
    formData.append('start', start.toString());
    formData.append('end', end.toString());
    formData.append('icon', iconImage?? '');
    const response = await api
        .post('meetings', formData )
        .catch((error) => {
          handleError(error, 'Unable to create meeting');
        });
    if (!response) return;
    const parsedMeeting = parseMeeting(response.data);
    setMeetingList((oldState) => [...oldState, parsedMeeting]);
    enqueueSnackbar(
        `Meeting titled \"${parsedMeeting?.title}\" was created`,
        snackbarSuccessOptions);
    return parsedMeeting;
  };
  /**
   * Logs the user out
   * Removes the stored token from react state and from local storage.
   * Sets the current user to null.
   */
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setLogoutStorage(Date.now().toString());
    setLoggedIn(false);
    try {
      logoutRequest();
    } catch (e) {
      handleError(e, 'Error when logging out');
      console.log(e);
    }
  };
  /**
   * Populate meetings on refresh
   */
  useEffect(() => {
    if (!token) return;
    getMeetings();
  }, [token]);

  const getMeetings = async () => {
    try {
      const response = await getAllMeetingsRequest();
      setMeetingList(response);
    } catch (e) {
      console.log(e);
    }
  };
  const deleteMeeting = async (id:string) => {
    try {
      await deleteMeetingRequest(id);
      removeMeetingFromList(id, false);
      enqueueSnackbar(`Meeting Deleted`, snackbarInfoOptions);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  /**
   * Adds the provided meeting to the meeting list and updates state
   * @param {Meeting} addedMeeting The meeting to add
   * @param {boolean } notify Whether or not a notification should appear
   * indicating the change. Defaults to true.
   */
  const addMeetingToList = (addedMeeting:Meeting, notify =true) => {
    setMeetingList((oldState) => {
      /* Guard against duplicates*/
      const meetingFound = oldState.find((meeting) =>
        addedMeeting.id.toHexString() === meeting.id.toHexString());
      if (meetingFound) {
        return oldState;
      }
      notify && enqueueSnackbar(
          `New meeting titled \"${addedMeeting?.title}\" available`,
          snackbarInfoOptions);
      return [...oldState, addedMeeting];
    });
  };
  /**
   * Removes the provided meeting from meeting list and updates state
   * @param {String} id The id of the meeting to remove
   * @param {boolean } notify Whether or not a notification should appear
   * indicating the change. Defaults to true.
   */
  const removeMeetingFromList = (id:string, notify =true) => {
    setMeetingList((oldState) => {
      const meetingIndex = oldState.findIndex((meeting) =>
        id === meeting.id.toHexString());
      if (meetingIndex > -1) {
        notify && enqueueSnackbar(
            `Meeting titled \"${oldState[meetingIndex].title}\" 
            no long available`, snackbarInfoOptions);
        const newState= [...oldState];
        newState.splice(meetingIndex, 1);
        return newState;
      }
      return oldState;
    });
  };

  return (
    <RestContext.Provider
      value={{
        login,
        logout,
        refreshToken,
        checkIfLogged,
        currentUser,
        setCurrentUser,
        loggedIn,
        createUser,
        createMeeting,
        findMeeting,
        meetingList,
        token,
        deleteMeeting,
        addMeetingToList,
        removeMeetingFromList,
      }}
    >
      {children}
    </RestContext.Provider>
  );
};
const snackbarSuccessOptions: OptionsObject = {
  variant: 'success',
  autoHideDuration: 2000,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
};

const snackbarWarnOptions :OptionsObject = {
  variant: 'warning',
  autoHideDuration: 2000,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
};
const snackbarInfoOptions :OptionsObject = {
  variant: 'info',
  autoHideDuration: 2000,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
};

export interface IRestContext {
  login: (credentials: ILoginCredentials) => Promise<User| undefined>,
  logout: () => void,
  refreshToken: () => void,
  loggedIn: boolean,
  createUser: (newUser: INewUser) => Promise<User| undefined>,
  createMeeting: (newMeeting: INewMeeting) => Promise<Meeting | undefined>
  meetingList: Meeting[]
  currentUser: User| null,
  setCurrentUser: (user:User | null) => void,
  findMeeting: (id:string) => Promise<Meeting | undefined>
  token: string | null,
  checkIfLogged: ()=> void,
  deleteMeeting: (id:string) => Promise<boolean>;
  addMeetingToList: (meeting:Meeting) => void;
  removeMeetingFromList: (id:string) => void;
}

RestContext.displayName = 'Rest Context';


export {RestContextProvider, RestContext};

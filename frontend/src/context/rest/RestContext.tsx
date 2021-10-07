/* eslint-disable no-unused-vars */
import React, {
  createContext, useContext,
  useEffect, useRef,
  useState,
} from 'react';
import {OptionsObject, useSnackbar} from 'notistack';
import {AxiosError, AxiosRequestConfig} from 'axios';
import ObjectID from 'bson-objectid';

import {ChildrenProps} from '../../shared/types';
import User from '../../shared/classes/User.js';
import {
  IReceivedMeeting,
  parseMeeting,
  parseUser,
} from '../../util/classParser';
import {
  api, loginRequest, logoutRequest,
  refreshToken,
  setRequestInterceptor,
  setResponseInterceptor,
} from './api.service';
import Meeting from '../../shared/classes/Meeting';
import {SocketIOContext} from '../SocketIOContext';
import useLocalStorage from 'react-use-localstorage';

// const loginBaseUrl = process.env.LOGIN_BASE_URL || 'localhost:5000/forms';

export interface IRestContext {
  login: (credentials: ILoginCredentials) => Promise<User| undefined>,
  logout: () => void,
  loggedIn: boolean,
  createUser: (newUser: INewUser) => Promise<User| undefined>,
  createMeeting: (newMeeting: INewMeeting) => Promise<Meeting | undefined>
  meetingList: Meeting[]
}

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
}
export interface INewMeeting {
  title: string,
}

const RestContextProvider = ({children}: Props) => {
  // TODO check for cookie on refresh (persist login)
  // TODO logout across tabs (local storage logout key)
  const {setCurrentUser} = useContext(SocketIOContext);
  const {enqueueSnackbar} = useSnackbar();
  const [token, setToken] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const [logoutStorage, setLogoutStorage] = useLocalStorage('logout', '');
  const axiosConfig = useRef<AxiosRequestConfig>(
      {headers: {Authorization: ''}},
  );
  const updateTokenExternally = (token:string, user:User) => {
    setToken(token);
    setCurrentUser(user);
  };

  /**
   * Check if currently logged in on first load.
   */
  useEffect(() => {
    // TODO not working
    const checkIfLogged = async () => {
      try {
        // Check if localstorage indicating a logout value is populated
        // if an empty string is found, the user has not set the value
        if (logoutStorage !== '') return;
        const {token, user} = await refreshToken();
        setToken(token);
        setCurrentUser(user);
        setLoggedIn(true);
        console.log('logged in');
      } catch (err) {
        console.log('Not logged in');
      }
    };
    checkIfLogged();
  }, []);

  /**
   * Check if currently logged in on first load.
   */
  useEffect(() => {
    // TODO not working
    if (!isNaN(Date.parse(logoutStorage))) logout();
    console.log('logout storage parse', !isNaN(Date.parse(logoutStorage)));
  }, [logoutStorage]);


  /**
   * Updates the axios config parameters when token updates
   * Sets Logged to true
   */
  useEffect(() => {
    axiosConfig.current.headers.Authorization = `Bearer ${token}`;
    if (token) setLoggedIn(true);
    else setLoggedIn(false);
  }, [token]);

  const handleError = (error:any, message:string) => {
    if (error?.response?.status === 401) {
      enqueueSnackbar(message, snackbarWarnOptions);
    }
    return;
  };
  /**
   * Listens for logout variable to be set in localstorage
   * Allows for logout across multiple tabs.
   */
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const syncLogout = (event:StorageEvent) => {
      if (event.key === 'logout') {
        setToken(null);
      }
      window.addEventListener('storage', syncLogout);
      return () => {
        window.removeEventListener('storage', syncLogout);
      };
    };
  }, []);
  /**
   * Set interceptors on first load.
   */
  useEffect(() => {
    const requestInterceptor = setRequestInterceptor(token);
    const responseInterceptor = setResponseInterceptor(
        updateTokenExternally,
        handleError,
    );
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.request.eject(responseInterceptor);
    };
  }, []);

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
      // if (!response) handleError(response, failedLoginMessage);
      const {token: receivedToken, user} = response;
      setToken(receivedToken);
      const parsedUser = parseUser(user);
      setCurrentUser(parsedUser);
      enqueueSnackbar(`Welcome ${parsedUser.fullName}`, snackbarSuccessOptions);
      setLogoutStorage('');
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
    const newId = new ObjectID();
    const userToSubmit = {
      ...newUser,
      id: newId,
    };
    const response = await api.post('users', userToSubmit)
        .catch((error) => handleError(error, 'Unable to create user'));
    if (!response) return;
    const user = response.data;
    const parsedUser = parseUser(user);
    enqueueSnackbar(
        `xAccount for ${parsedUser.email} created`,
        snackbarSuccessOptions);
    return parsedUser;
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
    const newId = new ObjectID();
    const meetingToSubmit = {
      ...newMeeting,
      id: newId,
    };
    const response = await api
        .post('meetings', meetingToSubmit)
        .catch((error) => {
          handleError(error, 'Unable to create meeting');
        });
    if (!response) return;
    const meeting = response.data;
    const parsedMeeting = parseMeeting(meeting);
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
    const response = await api.get('meetings');
    const meetings: Meeting[] = response.data.map(
        (meeting:IReceivedMeeting) => parseMeeting(meeting),
    );
    setMeetingList(meetings);
  };

  return (
    <RestContext.Provider
      value={{
        login,
        logout,
        loggedIn,
        createUser,
        createMeeting,
        meetingList,
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


export {RestContextProvider, RestContext};

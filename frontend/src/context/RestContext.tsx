// eslint-disable-next-line no-unused-vars
import React, {
  createContext,
  useEffect, useRef,
  useState,
} from 'react';
import {OptionsObject, useSnackbar} from 'notistack';
import axios, {AxiosError} from 'axios';

import {ChildrenProps} from '../shared/types';
import User from '../shared/classes/User.js';
import {parseMeeting, parseUser} from '../util/classParser';
import {ObjectId} from 'mongodb';
import Meeting from '../shared/classes/Meeting';

// const loginBaseUrl = process.env.LOGIN_BASE_URL || 'localhost:5000/forms';

export interface IRestContext {
  login: (credentials: ILoginCredentials) => Promise<User| undefined>,
  logout: () => void,
  loggedIn: string | null,
  createUser: (newUser: INewUser) => Promise<User| undefined>,
  createMeeting: (newMeeting: INewMeeting) => Promise<Meeting | undefined>
}

const RestContext = createContext<Partial<IRestContext>>({});

interface Props extends ChildrenProps {
  setCurrentUser: (user:User | null) => void
}

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


const RestContextProvider : React.FC<Props> = ({setCurrentUser, children}) => {
  // TODO store token more securely
  const {enqueueSnackbar} = useSnackbar();
  const [token, setToken] = useState(null);
  const axiosConfig = useRef({headers: {Authorization: ''}});

  /**
   * Check if currently logged in on first load.
   * If local storage contains a login token
   */
  useEffect(() => {
    return () => {
      const localStorageItem = window.localStorage.getItem('token');
      if (localStorageItem) {
        const {token, user} = JSON.parse(localStorageItem);
        setToken(token);
        setCurrentUser(parseUser(user));
      }
    };
  }, []);
  /**
   * Updates the axios config parameters when token updates
   */
  useEffect(() => {
    axiosConfig.current.headers.Authorization = `bearer ${token}`;
  }, [token]);

  const handleError = (error:AxiosError, message:string) => {
    console.log('request error', error);
    if (error?.response?.status === 401) {
      enqueueSnackbar(message, snackbarWarnOptions);
    }
    return;
  };


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
    const response = await axios.post('http://localhost:5000/login', credentials)
        .catch((error) => handleError(error, failedLoginMessage));
    if (!response) return;
    const {user, token} = response.data;
    setToken(token);
    window.localStorage.setItem('token', JSON.stringify(response.data));
    const parsedUser = parseUser(user);
    setCurrentUser(parsedUser);
    enqueueSnackbar(`Welcome ${parsedUser.fullName}`, snackbarSuccessOptions);
    return parsedUser;
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
    const newId = new ObjectId();
    const userToSubmit = {
      ...newUser,
      id: newId,
    };
    const response = await axios.post('http://localhost:5000/users', userToSubmit)
        .catch((error) => handleError(error, 'Unable to create user'));
    if (!response) return;
    const user = response.data;
    const parsedUser = parseUser(user);
    enqueueSnackbar(
        `Account for ${parsedUser.email} created`,
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
    const newId = new ObjectId();
    const meetingToSubmit = {
      ...newMeeting,
      id: newId,
    };
    const response = await axios.post('http://localhost:5000/meetings', meetingToSubmit, axiosConfig.current)
        .catch((error) => handleError(error, 'Unable to create meeting'));
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
    window.localStorage.removeItem('token');
  };

  return (
    <RestContext.Provider
      value={{login, logout, loggedIn: token, createUser, createMeeting}}
    >
      {children}
    </RestContext.Provider>
  );
};


export {RestContextProvider, RestContext};

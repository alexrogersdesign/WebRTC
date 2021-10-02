// eslint-disable-next-line no-unused-vars
import React, {
  createContext,
  useEffect, useRef,
  useState,
} from 'react';
import {OptionsObject, useSnackbar} from 'notistack';
import axios from 'axios';

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
  const {enqueueSnackbar} = useSnackbar();
  const [token, setToken] = useState(null);
  const axiosConfig = useRef({headers: {Authorization: ''}});

  /**
   * Check if currently logged in on first load
   */
  useEffect(() => {
    return () => {
      const localStorageItem = window.localStorage.getItem('loggedUser');
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


  // eslint-disable-next-line max-len
  const login = async (credentials: ILoginCredentials):Promise<User | undefined> => {
    const failedLoginMessage = 'Invalid Username or Password';
    const response = await axios.post('http://localhost:5000/login', credentials)
        .catch((error) => {
          console.log('request error', error);
          if (error.response.status === 401) {
            enqueueSnackbar(failedLoginMessage, snackbarWarnOptions);
          }
          return;
        });
    if (!response) return;
    const {user, token} = response.data;
    setToken(token);
    window.localStorage.setItem('loggedUser', JSON.stringify(response.data));
    const parsedUser = parseUser(user);
    setCurrentUser(parsedUser);
    enqueueSnackbar(`Welcome ${parsedUser.fullName}`, snackbarSuccessOptions);
    return parsedUser;
  };

  const createUser = async (newUser: INewUser):Promise<User | undefined> => {
    const newId = new ObjectId();
    const userToSubmit = {
      ...newUser,
      id: newId,
    };
    console.log('user tp submit', userToSubmit);
    const response = await axios.post('http://localhost:5000/users', userToSubmit)
        .catch((error) => {
          console.log('request error', error);
          if (error.response.status === 401) {
            enqueueSnackbar('Unable to create user', snackbarWarnOptions);
          }
          return;
        });
    if (!response) return;
    console.log('response', response);
    const user = response.data;
    const parsedUser = parseUser(user);
    enqueueSnackbar(
        `Account for ${parsedUser.email} created`,
        snackbarSuccessOptions);
    return parsedUser;
  };
  // eslint-disable-next-line max-len
  const createMeeting = async (newMeeting: INewMeeting):Promise<Meeting | undefined> => {
    const newId = new ObjectId();
    const meetingToSubmit = {
      ...newMeeting,
      id: newId,
    };
    console.log('meeting tp submit', meetingToSubmit);
    const response = await axios.post('http://localhost:5000/meetings', meetingToSubmit, axiosConfig.current)
        .catch((error) => {
          console.log('request error', error);
          if (error.response.status === 401) {
            enqueueSnackbar('Unable to create meeting', snackbarWarnOptions);
          }
          return;
        });
    if (!response) return;
    console.log('response', response);
    const meeting = response.data;
    const parsedMeeting = parseMeeting(meeting);
    enqueueSnackbar(
        `Meeting titled \"${parsedMeeting?.title}\" was created`,
        snackbarSuccessOptions);
    return parsedMeeting;
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    window.localStorage.removeItem('loggedUser');
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

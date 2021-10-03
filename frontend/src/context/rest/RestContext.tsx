/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useEffect, useRef,
  useState,
} from 'react';
import {OptionsObject, useSnackbar} from 'notistack';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import jwtDecode from 'jwt-decode';

import {ChildrenProps} from '../../shared/types';
import User from '../../shared/classes/User.js';
import {parseMeeting, parseUser} from '../../util/classParser';
import {ObjectId} from 'mongodb';
import Meeting from '../../shared/classes/Meeting';
import {useLocalStorage} from '../../hooks/useLocalStorage';
// import instance from './rest.service';

// const loginBaseUrl = process.env.LOGIN_BASE_URL || 'localhost:5000/forms';

export interface IRestContext {
  login: (credentials: ILoginCredentials) => Promise<User| undefined>,
  logout: () => void,
  loggedIn: InMemoryToken | null,
  createUser: (newUser: INewUser) => Promise<User| undefined>,
  createMeeting: (newMeeting: INewMeeting) => Promise<Meeting | undefined>
}

const RestContext = createContext<Partial<IRestContext>>({});

interface Props extends ChildrenProps {
  setCurrentUser: (user:User | null) => void,
  currentUser: User | null,
}

export type DecodedToken = {
  email: string,
  id: string
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

type InMemoryToken = {
  token: string,
  expiration: string
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

const RestContextProvider : React.FC<Props> = ({
  setCurrentUser,
  currentUser,
  children,
}) => {
  // TODO store token more securely
  const {enqueueSnackbar} = useSnackbar();
  const [token, setToken] = useState<InMemoryToken | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [logoutStorage, setLogoutStorage] = useLocalStorage('logout', '');
  // eslint-disable-next-line max-len
  const axiosConfig = useRef<AxiosRequestConfig>({headers: {Authorization: ''}});
  const api = useRef(axios.create({
    baseURL: '/',
    headers: {
      'Content-Type': 'application/json',
    },
    validateStatus: (status) => status < 400,
  }));

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
    axiosConfig.current.headers.Authorization = `Bearer ${token}`;
    axiosConfig.current.headers['x-access-token'] = token;
  }, [token]);

  const handleError = (error:AxiosError, message:string) => {
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
  const setRequestInterceptor = () => {
    return api.current.interceptors.request.use((config) => {
      console.info('Starting Request', JSON.stringify(config, null, 2));
      if (token) {
        // config.headers['Authorization'] = 'Bearer ' + token.token;
        config.headers['x-access-token'] = token;
        // for Node.js Express back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    });
  };
  // const isRetrying = useRef(false);
  const setResponseInterceptor = () => {
    return api.current.interceptors.response.use((res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (process.env.NODE_ENV === 'development') {
        console.log(err.response.data.message, err.toJSON());
      }
      if (originalConfig.url !== '/login' && err.response) {
        //* Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            //* Retrieve email from token
            const authHeader = originalConfig.headers.Authorization;
            const tokenToDecode = authHeader.split(' ')[1];
            const {email} = jwtDecode<DecodedToken>(tokenToDecode);
            // eslint-disable-next-line max-len
            const response = await api.current.post('/login/refresh', {email} );
            const {token} = response.data;
            setToken(token);
            originalConfig.headers.Authorization= `Bearer ${token}`;
            console.log('new token', token);
            return api.current(originalConfig);
          } catch (_error) {
            console.log(_error);
            if (_error instanceof Error) {
              handleError(
                  (_error as AxiosError),
                  'Error when retrying request',
              );
            }
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    });
  };
  useEffect(() => {
    const requestInterceptor = setRequestInterceptor();
    const responseInterceptor = setResponseInterceptor();
    return () => {
      api.current.interceptors.request.eject(requestInterceptor);
      api.current.interceptors.request.eject(responseInterceptor);
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
    const response = await api.current.post('/login', credentials)
        .catch((error) => handleError(error, failedLoginMessage));
    if (!response) return;
    const {user, token} = response.data;
    setToken(token);
    console.log('refresh token', token);
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
    const response = await api.current.post('users', userToSubmit)
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
    const newId = new ObjectId();
    const meetingToSubmit = {
      ...newMeeting,
      id: newId,
    };
    const response = await api.current
        .post('meetings', meetingToSubmit, axiosConfig.current)
        .catch((error) => {
          handleError(error, 'Unable to create meeting');
        });
    // .catch((error) => {
    //   handleError(error, 'Unable to create meeting');
    // });

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
    setLogoutStorage(Date.now());
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

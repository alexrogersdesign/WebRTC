import {useEffect, useState} from 'react';
import axios from 'axios';

import User from '../../shared/classes/User';
import {
  IReceivedMeeting,
  IReceivedUser,
  parseMeeting,
  parseUser} from '../../util/classParser';
import {ILoginCredentials} from './RestContext';
import Meeting from '../../shared/classes/Meeting';

const useRestApi = (
    initialToken:string | null,
    errorHandler: (error:any, message?:string) => void,
) => {
  // TODO remove unneeded header setting
  const [token, setToken] = useState<string| null>(initialToken);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  //* An axios instance to make the http calls to the backend server
  const api = axios.create({
    baseURL: '',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    // validateStatus: (status) => status < 400,
  });


  // eslint-disable-next-line valid-jsdoc
  /**
 * Sets interceptor
 * TODO update functionality
 * @return {}
 */
  const setRequestInterceptor = () => {
    return api.interceptors.request.use((config) => {
      // console.info('Starting Request', JSON.stringify(config, null, 2));
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      config.headers['x-access-token'] = token? token: '';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    });
  };

type refreshResponse = {
  newToken: string,
  user: User
}

const refreshToken = async ():Promise<refreshResponse> => {
  const response = await axios.post('/login/refresh');
  const {token: newToken, user: receivedUser} = response.data;
  if (!newToken) throw new Error('No token received on refresh');
  if (!receivedUser) throw new Error('No user data received on refresh');
  const user = parseUser(receivedUser);
  setToken(newToken);
  return {newToken, user};
};

// eslint-disable-next-line valid-jsdoc
/**
 * Sets axios response interceptor which intercepts failed requests and
 * attempts to retry them. If request fails due to lack of authorization.
 * Refreshing the token is attempted.
 * to send the updated token to.
 * an error handler function.
 * @return {number} number representation of the interceptor to allow
 * cleanup from an external function.
 */
const setResponseInterceptor = () => {
  return api.interceptors.response.use((res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (process.env.NODE_ENV === 'development') {
      console.log(err.response.data.message, err.toJSON());
    }
    if (originalConfig.url !== '/login' && err.response) {
      //* Access Token was expired
      if (err.response.status === 401) {
        if (originalConfig._retry) {
          errorHandler(err, 'Please Login Again');
          throw new Error('Token Refresh Failed');
        }
        originalConfig._retry = true;
        try {
          const {newToken, user} = await refreshToken();
          setCurrentUser(user);
          setToken(newToken);
          originalConfig.headers.Authorization= `Bearer ${newToken}`;
          originalConfig.headers['x-access-token'] = newToken;
          return api(originalConfig);
        } catch (error) {
          errorHandler(error);
          return Promise.reject(error);
        }
      }
    } else errorHandler(err);
    return Promise.reject(err);
  });
};
//* Update access header when token is updated
useEffect(() => {
  // eslint-disable-next-line max-len
  api.defaults.headers.common['Authorization'] = token? `Bearer ${token}`: '';
  api.defaults.headers.common['x-access-token'] = token? token: '';
}, [token]);


/**
   * Set interceptors on first load.
   */
useEffect(() => {
  const requestInterceptor = setRequestInterceptor();
  const responseInterceptor = setResponseInterceptor();
  return () => {
    api.interceptors.request.eject(requestInterceptor);
    api.interceptors.request.eject(responseInterceptor);
  };
}, [api]);

// eslint-disable-next-line max-len
const loginRequest = async (credentials: ILoginCredentials):Promise<LoginResponse> => {
  const response = await api.post('/login', credentials);
  if (!response) throw new Error('No response from server');
  return response.data;
};

const logoutRequest = async () => {
  await api.get('/login/logout');
};

const findMeetingRequest = async (id:string) : Promise<Meeting | undefined> => {
  const response = await api.get(`/meetings/${id}`);
  return parseMeeting(response.data);
};
const getAllMeetingsRequest = async () : Promise<Meeting[]> => {
  const response = await api.get('/meetings/');
  return response.data.map(
      (meeting:IReceivedMeeting) => parseMeeting(meeting),
  );
};

return {
  token,
  setToken,
  currentUser,
  setCurrentUser,
  api,
  refreshToken,
  findMeetingRequest,
  loginRequest,
  logoutRequest,
  getAllMeetingsRequest,
};
};
export {useRestApi};

export type LoginResponse = {
  user: IReceivedUser,
  token: string
}


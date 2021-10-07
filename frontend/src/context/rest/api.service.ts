import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import User from '../../shared/classes/User';
import {IReceivedUser, parseMeeting, parseUser} from '../../util/classParser';
import {ILoginCredentials} from './RestContext';
import Meeting from '../../shared/classes/Meeting';

/**
 * An axios instance to make the http calls to the backend server
 */
const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 400,
});

const axiosConfig: AxiosRequestConfig = {headers: {Authorization: ''}};


// eslint-disable-next-line valid-jsdoc
/**
 * Sets interceptor
 * //TODO update functionality
 * @return {}
 */
const setRequestInterceptor = (token: string | null) => {
  return api.interceptors.request.use((config) => {
    // console.info('Starting Request', JSON.stringify(config, null, 2));
    // config.headers.Authorization = `Bearer ${token}`;
    if (token) config.headers['x-access-token'] = token;
    console.log(token);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  });
};

type refreshResponse = {
  token: string,
  user: User
}

const refreshToken = async ():Promise<refreshResponse> => {
  const response = await axios.post('/login/refresh');
  const {token, user: receivedUser} = response.data;
  if (!token) throw new Error('No token received on refresh');
  if (!receivedUser) throw new Error('No user data received on refresh');
  const user = parseUser(receivedUser);
  return {token, user};
};

// eslint-disable-next-line valid-jsdoc
/**
 * Sets axios response interceptor which intercepts failed requests and
 * attempts to retry them. If request fails due to lack of authorization.
 * Refreshing the token is attempted.
 * @param {(string) => void} updateTokenExternally a function
 * to send the updated token to.
 * @param {(AxiosError, string) => void} handleError
 * an error handler function.
 * @return {number} number representation of the interceptor to allow
 * cleanup from an external function.
 */
const setResponseInterceptor = (
    updateTokenExternally: (token:string, user:User) => void,
    handleError: (error: AxiosError, message: string) => void,
) => {
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
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const {token, user} = await refreshToken();
          updateTokenExternally(token, user);
          originalConfig.headers.Authorization= `Bearer ${token}`;
          return api(originalConfig);
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
export type LoginResponse = {
  user: IReceivedUser,
  token: string
}

// eslint-disable-next-line max-len
const loginRequest = async (credentials: ILoginCredentials):Promise<LoginResponse> => {
  const response = await api.post('/login', credentials);
  // .catch((error) => handleError(error, failedLoginMessage));
  if (!response) throw new Error('No response from server');
  return response.data;
};

const logoutRequest = async () => {
  await api.get('login/logout');
};

const findMeeting = async (id:string) : Promise<Meeting | undefined> => {
  const response = await api.get(`meetings/${id}`, axiosConfig);
  return parseMeeting(response.data);
};

export {
  api,
  refreshToken,
  setResponseInterceptor,
  setRequestInterceptor,
  findMeeting,
  loginRequest,
  logoutRequest,
};

import axios, {AxiosError} from 'axios';
import User from '../../shared/classes/User';
import {parseUser} from '../../util/classParser';

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
// eslint-disable-next-line valid-jsdoc
/**
 * Sets interceptor
 * //TODO update functionality
 * @return {}
 */
const setRequestInterceptor = () => {
  return api.interceptors.request.use((config) => {
    // console.info('Starting Request', JSON.stringify(config, null, 2));
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
  const {token, receivedUser: receivedUser} = response.data;
  if (!token || !receivedUser) throw new Error('Could not refresh token');
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
          console.log('new token', token);
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

export {api, refreshToken, setResponseInterceptor, setRequestInterceptor};

import {useEffect, useRef, useState} from 'react';
import axios, {AxiosError, AxiosRequestConfig} from 'axios';

import User from '../shared/classes/User';
import {
  IReceivedUser,
  parseUser} from '../util/classParser';
import {AuthenticationError} from '../util/errors/AuthenticationError';

export type RefreshResponse = {
  newToken: string,
  user: User
}
/**
 * @typedef {Object} useRestApiReturn
 * @param {string} token The current token.
 * @param { React.Dispatch<React.SetStateAction<string | null>>} setToken
 * A function for setting the token.
 * @param {User} currentUser The currently logged in User.
 * @param { React.Dispatch<React.SetStateAction<User | null>>} setCurrentUser
 * A function for setting the current user.
 * @param {AxiosInstance} Tue axios instance Api.
 * @param {function} Attempts to login with a refresh token.
 */

/**
 * A hook that handles the setup and authentication aspects of the
 * backend HTTP Api.
 * @param {string | null} initialToken
 * @param {function} errorHandler
 * @return {useRestApiReturn}
 */
const useRestApi = (
    initialToken:string | null,
    errorHandler: (error:any, message?:string) => void,
) => {
  const [token, setToken] = useState<string| null>(null);
  const [currentUser, setCurrentUser] = useState<User| null>(null);

  /** An axios instance to make the http calls to the backend server */
  const instance = useRef(axios.create({
    baseURL: '',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  }));
  const api = instance.current;

  /**
   * Sets Axios interceptor which intercepts all requests
   * and sets the content type header based on parameter of the request.
   * If the request is of type PUT or POST,the 'Content-Type' header will be
   * 'multipart/form-data' which allows the use of the FormData interface
   * and ultimately a buffer to be encapsulated for the icon to be sent.
   * If the request url is '/login' the 'Content-Type' header will be set to
   * 'application/json' since the FormData interface is not being used.
   * Otherwise the headers are not altered.
   * @return {number} The number representation of the interceptor to allow
   * the interceptor to be cleaned up.
   */
  const setRequestInterceptor = () => {
    return api.interceptors.request.use(async (config) => {
      if (config.url === '/login') {
        config.headers['Content-Type'] = 'application/json';
      } else if (config.method === 'post' || config.method === 'put') {
        config.headers['Content-Type'] = 'multipart/form-data';
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    });
  };
  interface AxiosRequestConfigRetry extends AxiosRequestConfig {
    _hasRetried: boolean
  }

  /**
   * Holds the logic for attempting a retry after a failed response is returned.
   * @param {AxiosError} err The AxiosError instance containing the error and
   * the original request configuration.
   * @return {Promise<AxiosResponse<any>>} The AxiosResponse to return
   * to the original request.
   */
  const attemptRetry = async (err:AxiosError ) => {
    /** _hasRetried key is added to indicate if this request has already
     * been retried once. If so, the attempt should be abandoned. */
    const originalConfig = err.config as AxiosRequestConfigRetry;
    if (originalConfig?._hasRetried) {
      errorHandler(err, 'Please Login Again');
      setToken(null);
      setCurrentUser(null);
      return Promise.reject(err);
    }
    /** Mark that a retry is being attempted */
    originalConfig._hasRetried = true;
    try {
      const {newToken} = await loginWithRefreshToken();
      originalConfig.headers['Authorization']= `Bearer ${newToken}`;
      return api(originalConfig);
    } catch (error) {
      errorHandler(error);
      return Promise.reject(error);
    }
  };

  /**
   * Sets axios response interceptor which intercepts failed requests and
   * attempts to retry them if the request failed from authorization and
   * it is not a login attempt.
   * @return {number} number representation of the interceptor to allow
   * the interceptor to be cleaned up.
   */
  const setResponseInterceptor = () => {
    /** if there is no error, pass the original response
     * through unaltered.*/
    return api.interceptors.response.use((res) => {
      return res;
    },
    async (err) => {
      /** Rethrow the error if it is not an AxiosError */
      if (!axios.isAxiosError(err)) return Promise.reject(err);
      /** Dont retry when request is a login attempt because
       * the error is likely due to bad credentials */
      if (err.config.url !== '/login') {
        console.log('retrying');
        /** If 401 response is received to a non '/login' url,
         * assume it is due to an expired token. */
        if (err.response?.status === 401) {
          await attemptRetry(err);
        }
      } else {
        errorHandler(err);
        return Promise.reject(err);
      }
      return Promise.reject(err);
    });
  };

  /**
   * Attempts to use the refresh token to login.
   * If the attempt is unsuccessful,an AuthenticationError
   * is thrown. If successful, the currentUser and token are updated
   * @return {Promise<RefreshResponse>} A object containing the token
   * and the user after a successful login.
   */
  const loginWithRefreshToken = async ():Promise<RefreshResponse> => {
    const response = await axios.post('/login/refresh');
    const {token: newToken, user: receivedUser} = response.data;
    if (!newToken) {
      throw new AuthenticationError('No token received on refresh');
    }
    if (!receivedUser) throw new Error('No user data received on refresh');
    const user = parseUser(receivedUser);
    setToken(newToken);
    setCurrentUser(user);
    return {newToken, user};
  };
  /** Synchronize 'Authorization' header when token is updated */
  useEffect(() => {
    api.defaults.headers.common['Authorization'] = token?
        `Bearer ${token}`:
        '';
  }, [token]);


  /**
   * Set interceptors on first load and whenever the API changes.
   */
  useEffect(() => {
    const requestInterceptor = setRequestInterceptor();
    const responseInterceptor = setResponseInterceptor();
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.request.eject(responseInterceptor);
    };
  }, [api]);
  return {
    token,
    setToken,
    currentUser,
    setCurrentUser,
    api,
    loginWithRefreshToken,
  };
};

export {useRestApi};

export type LoginResponse = {
  user: IReceivedUser,
  token: string
}


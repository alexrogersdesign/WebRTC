// eslint-disable-next-line no-unused-vars
import React, {
  createContext,
  useEffect,
  useState,
} from 'react';
import {OptionsObject, useSnackbar} from 'notistack';
import axios from 'axios';


import {ChildrenProps} from '../shared/types';
import User from '../shared/classes/User.js';
import {parseUser} from '../util/classParser';

export interface IRestContext {
  login: (credentials: ILoginCredentials) => Promise<User| undefined>,
  logout: () => void,
  loggedIn: string | null,
}
// const loginBaseUrl = process.env.LOGIN_BASE_URL || 'localhost:5000/forms';

const RestContext = createContext<Partial<IRestContext>>({});

interface Props extends ChildrenProps {
  setCurrentUser: (user:User | null) => void
}

export interface ILoginCredentials {
  email: string,
  password: string
}
export type LoginData = {
  token: string,
  user: User
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

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    window.localStorage.removeItem('loggedUser');
  };


  return (
    <RestContext.Provider value={{login, logout, loggedIn: token}}>
      {children}
    </RestContext.Provider>
  );
};


export {RestContextProvider, RestContext};

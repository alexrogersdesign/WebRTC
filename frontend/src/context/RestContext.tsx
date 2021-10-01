// eslint-disable-next-line no-unused-vars
import React, {
  createContext,
  useEffect,
  useState,
} from 'react';
import {useSnackbar} from 'notistack';
import axios from 'axios';


import {ChildrenProps} from '../shared/types';
import User from '../shared/classes/User.js';

export interface IRestContext {
  login: (credentials: ILoginCredentials) => Promise<void>,
  logout: () => void,
  loggedIn: string | null,
}
// const loginBaseUrl = process.env.LOGIN_BASE_URL || 'localhost:5000/login';

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
        setCurrentUser(user);
      }
    };
  }, []);

  const login = async (credentials: ILoginCredentials) => {
    const {data} = await axios.post('http://localhost:5000/login', credentials);
    const {user, token} = data;
    setToken(token);
    window.localStorage.setItem('loggedUser', JSON.stringify(data));
    setCurrentUser(user);
    enqueueSnackbar(`Welcome ${user.fullName}`);
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

// eslint-disable-next-line no-unused-vars
import React, {createContext, useEffect, useState, useContext} from 'react';
import {useSnackbar} from 'notistack';
import axios from 'axios';


import {ChildrenProps} from '../shared/types';
import User from '../shared/classes/User.js';
import {SocketIOContext} from './SocketIOContext.js';

export interface IRestContext {

}
const loginBaseUrl = process.env.LOGIN_BASE_URL || '/login';

const RestContext = createContext<Partial<IRestContext>>({});
const [token, setToken] = useState(null);

interface Props extends ChildrenProps {

}

export interface ILoginCredentials {
  email: string,
  password: string
}
export type LoginData = {
  token: string,
  user: User
}


const RestContextProvider : React.FC<Props> = ({children}) => {
  const {enqueueSnackbar} = useSnackbar();
  const {setCurrentUser} = useContext(SocketIOContext);

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
    const {data} = await axios.post(loginBaseUrl, credentials);
    const {user, token} = data;
    setToken(token);
    window.localStorage.setItem('ßloggedUser', JSON.stringify(data));
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

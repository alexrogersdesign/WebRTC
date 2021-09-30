// eslint-disable-next-line no-unused-vars
import React, {createContext, useEffect, useState, useRef} from 'react';
import {useSnackbar} from 'notistack';
import axios from 'axios';


import {ChildrenProps} from '../shared/types';

export interface IRestContext {

}
const loginBaseUrl = process.env.LOGIN_BASE_URL || '/login';

const RestContext = createContext<Partial<IRestContext>>({});
const token = useRef(null);

interface Props extends ChildrenProps {

}

export interface ILoginCredentials {
  email: string,
  password: string
}
export type LoginData = {
  token: string,
  email: string
}


const RestContextProvider : React.FC<Props> = ({children}) => {
  const {enqueueSnackbar} = useSnackbar();

  const login = (creds: ILoginCredentials) :LoginData | undefined => {
    let data: LoginData;
    (async () => {
      data = await axios.post(loginBaseUrl, creds);
    })();
    return data;
  };


  return (
    <RestContext.Provider value={}>
      {children}
    </RestContext.Provider>
  );
};


export {RestContextProvider, RestContext};

// eslint-disable-next-line no-unused-vars
import React, {createContext, useEffect, useState, useRef} from 'react';
import {useSnackbar} from 'notistack';

import {ChildrenProps, IRestContext} from '../shared/types';

const RestContext = createContext<Partial<IRestContext>>({});

interface Props extends ChildrenProps {
}

const RestContextProvider : React.FC<Props> = ({children}) => {
  const {enqueueSnackbar} = useSnackbar();


  return (
    <RestContext.Provider value={}>
      {children}
    </RestContext.Provider>
  );
};


export {RestContextProvider, RestContext};

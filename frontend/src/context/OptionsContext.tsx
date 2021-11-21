/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, {createContext, useEffect, useState, useContext} from 'react';
import createPersistedState from 'use-persisted-state';

// import {useSnackbar} from 'notistack';

import {ChildrenProps} from '../shared/types';
import useLocalStorage from 'react-use-localstorage';

const OptionsContext = createContext<IOptionsContext>(undefined!);

const useCounterState = createPersistedState('count');


interface Props extends ChildrenProps {}

const OptionsContextProvider : React.FC<Props> = ({children}) => {
  // const {enqueueSnackbar} = useSnackbar();
  // const [tutorialEnabled, setTutorialEnabled] = useState(true);
  const [tutorialEnabled, setTutorialEnabled] = useCounterState(true);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <OptionsContext.Provider
      value={{
        tutorialEnabled,
        setTutorialEnabled,
        helpOpen,
        setHelpOpen,
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
};

export interface IOptionsContext {
  tutorialEnabled: boolean
  setTutorialEnabled: (boolean:boolean)=>void
  helpOpen: boolean
  setHelpOpen: (boolean:boolean)=>void
}


OptionsContext.displayName = 'Options Context';

export {OptionsContextProvider, OptionsContext};

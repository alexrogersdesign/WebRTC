/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, {createContext, useState} from 'react';
import createPersistedState from 'use-persisted-state';


import {ChildrenProps} from '../shared/types';

const OptionsContext = createContext<IOptionsContext>(undefined!);

const useCounterState = createPersistedState('count');


interface Props extends ChildrenProps {}

const OptionsContextProvider : React.FC<Props> = ({children}) => {
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

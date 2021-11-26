import React, {createContext, useState} from 'react';
import useLocalStorageState from 'use-local-storage-state';


import {ChildrenProps} from '../shared/types';

/** The context for app options */
const OptionsContext = createContext<IOptionsContext>(undefined!);

/**
 * A context provider for OptionsContext.
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const OptionsContextProvider : React.FC<ChildrenProps> = ({children}) => {
  const [tutorialEnabled, setTutorialEnabled] = useLocalStorageState(
      'tutorial',
      true,
  );

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

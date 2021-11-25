import React, {createContext} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import getTheme, {ThemeOption, themes} from '../util/theme/getTheme';

import {ChildrenProps} from '../shared/types';
import {FontLoader} from '../components/common/FontLoader';
import useLocalStorageState from 'use-local-storage-state';

interface IThemeContext {
  setTheme: (option:ThemeOption) => void,
  theme: ThemeOption
}

/** Context that provides the ability to change themes */
export const CustomThemeContext = createContext<IThemeContext>(undefined!);

/**
 * A context provider for CustomThemeContext.
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const CustomThemeProvider = ({children}: ChildrenProps) :JSX.Element=> {
  const [themeName, setThemeName] = useLocalStorageState<ThemeOption>(
      'appTheme',
      'normal',
  );
  /**
   * Checks if provided name is a valid theme name.
   * Casts the name as a theme option.
   * @param {string} name The theme name to check.
   * @return {boolean} True if the theme name is valid
   */
  const isThemeOption = (name:string): name is ThemeOption => {
    return name in themes;
  };
  /** Check if the theme name retrieved from local storage
   *  is a valid theme name */
  if (!isThemeOption(themeName)) {
    setThemeName('normal');
  }
  /** retrieve the theme data associated with the theme name */
  const theme = getTheme(themeName);

  return (
    <CustomThemeContext.Provider value={{
      setTheme: setThemeName,
      theme: themeName,
    }}>
      <ThemeProvider theme={theme}>
        <FontLoader/>
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

CustomThemeContext.displayName = 'Custom Theme Context';


export default CustomThemeProvider;

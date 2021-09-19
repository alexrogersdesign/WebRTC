// import {Theme} from '@material-ui/core/styles';


import active from './active';
import inactive from './inactive';
import light from './light';

export const themes = {
  normal: active,
  dark: inactive,
  light,
};
export type ThemeOption = keyof typeof themes;

/**
 * A theme selector component that returns themes
 * @param {string} theme the theme to retreive
 * @return {Theme} theme
 */
export default function getTheme(theme:ThemeOption) {
  return themes[theme];
}

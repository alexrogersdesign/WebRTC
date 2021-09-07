import {createTheme, Theme, ThemeOptions} from '@material-ui/core/styles';
/**
 * Factory used to create custom theme objects
 * @param {ThemeOptions} themeOptions options for the theme
 * @return {Theme} the created theme
 */
export default function themeFactory(themeOptions: ThemeOptions): Theme {
  return createTheme({
    ...themeOptions,
  });
}

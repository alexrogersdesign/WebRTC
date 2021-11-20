/* eslint-disable no-unused-vars */

import red from '@material-ui/core/colors/red';
import {createTheme} from '@material-ui/core/styles';
import {baseTheme} from './base';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    neutral: Palette['primary'];
    disabled: Palette['primary'];
    neutralGray: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
    disabled: PaletteOptions['primary'];
    neutralGray: PaletteOptions['primary'];
  }
}
// A custom theme for this app
const theme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: {
      main: '#90a4ae',
      light: '#c1d5e0',
      dark: '#62757f',
    },
    secondary: {
      main: '#424242',
      light: '#6d6d6d',
      dark: '#1b1b1b',
    },
    neutral: {
      main: '#E0E3E1',
      light: '#F5F5F6',
    },
    neutralGray: {
      main: '#757575',
      light: '#a4a4a4',
      dark: '#494949',
    },
    disabled: {
      main: '#f44336',
      light: '#ff7961',
      dark: 'ba000d',
    },
    help: {
      main: '#ffee58',
      light: '#ffff8b',
      dark: '#c9bc1f',
      contrastText: '#fff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#6d6d6d',
      // default: '#F5F5F6',
    },
  },
});

export default theme;

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
      main: '#42a5f5',
      light: '#80d6ff',
      dark: '#0077c2',
    },
    secondary: {
      main: '#e57373',
      light: '#ffa4a2',
      dark: '#af4448',
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
    error: {
      main: red.A400,
    },
    background: {
      default: '#E0E3E1',
      // default: '#F5F5F6',
    },
  },
});

export default theme;

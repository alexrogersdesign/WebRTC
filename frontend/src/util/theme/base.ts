/* eslint-disable no-unused-vars */

import red from '@material-ui/core/colors/red';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

 declare module '@material-ui/core/styles/createPalette' {
     interface Palette {
        neutral: Palette['primary'];
        disabled: Palette['primary'];
        neutralGray: Palette['primary'];
        help: Palette['primary'];
     }
 }

 declare module '@material-ui/core/styles/createBreakpoints' {
   interface BreakpointOverrides {
     xxs: true;
     xs: true,
     sm: true,
     md: true,
     lg: true,
     xl: true,
   }
 }
const breakpoints = createBreakpoints({
  values: {
    xxs: 400,
    xs: 500,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
});

const baseTheme = {
  typography: {
  // fontFamily: ['Nunito', 'sans-serif'].join(','),
  },
  breakpoints,
  palette: {
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
    },
    help: {
      main: '#ffee58',
      light: '#ffff8b',
      dark: '#c9bc1f',
      contrastText: '#fff',
    },
  },
};

export {baseTheme};

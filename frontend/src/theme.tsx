/* eslint-disable no-unused-vars */

import red from '@material-ui/core/colors/red';
import {createTheme} from '@material-ui/core/styles';

// declare module '@material-ui/core/styles/createTheme' {
//   interface Theme {
//     status: {
//       danger: React.CSSProperties['color'],
//     }
//   }
//   interface ThemeOptions {
//     status: {
//       danger: React.CSSProperties['color']
//     }
//   }
// }

// declare module '@material-ui/core/styles/createPalette' {
//   interface Palette {
//     neutral: Palette['primary'];
//   }
//   interface PaletteOptions {
//     neutral: PaletteOptions['primary'];
//   }
// }

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#42a5f5',
      light: '80d6ff',
      dark: '#0077c2',
    },
    secondary: {
      main: '#e57373',
      light: '#ffa4a2',
      dark: '#af4448',
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

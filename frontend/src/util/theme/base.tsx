/* eslint-disable no-unused-vars */

import {createTheme} from '@material-ui/core/styles';

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
const baseTheme = createTheme({
  typography: {
    // fontFamily: ['Nunito', 'sans-serif'].join(','),
  },
});

export {baseTheme};

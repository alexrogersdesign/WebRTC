import {createTheme} from '@material-ui/core/styles';
import {baseTheme} from './base';

const theme = createTheme({
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
  },
}, baseTheme);
export default theme;

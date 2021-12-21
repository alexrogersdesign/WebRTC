import {createTheme} from '@material-ui/core/styles';
import {baseTheme} from './base';

const theme = createTheme( {
  palette: {
    ...baseTheme.palette,
    primary: {
      main: '#5085a5',
      light: '#8fc1e3',
      dark: '#31708e',
    },
    secondary: {
      main: '#95a193',
      light: '#b4bcb2',
      dark: '#687864',
    },
  },
}, baseTheme);

export default theme;

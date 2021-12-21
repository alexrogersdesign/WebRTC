import {createTheme} from '@material-ui/core/styles';
import {baseTheme} from './base';

const theme = createTheme({
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
  },
}, baseTheme);

export default theme;

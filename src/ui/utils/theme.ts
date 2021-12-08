import { createTheme } from "@mui/material/styles";
import { blue } from '@mui/material/colors';

export const osColor =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
  
export const themeCreator = () => createTheme({
  palette: {
    // mode: osColor ? 'dark' : 'light',
    primary: blue,
    secondary: {
      main: '#ffa726',
    },
  },
});
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { pink, red, teal, blue, indigo} from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[400],
    },
    secondary: {
      main: teal[400],
    },
    snow: "#F8F8F8",
    text: {
      positive: "green",
      negative: "red",
    }
  },
});

const rootElement = document.getElementById('root');


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App/>
    </ThemeProvider>
  </React.StrictMode>,
  rootElement
);

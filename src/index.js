import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
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

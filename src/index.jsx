import MomentUtils from '@date-io/moment';
import { indigo, teal } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[400],
    },
    secondary: {
      main: teal[400],
      snow: "#F8F8F8",
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
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <App />

      </MuiPickersUtilsProvider>

    </ThemeProvider>
  </React.StrictMode>,
  rootElement
);

import {useState} from 'react'
import { Container } from '@material-ui/core'
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

/* Page Components */
import Header from './components/Header';

/* Page Body Options */
import Login from './components/Pages/Login'
import Dashboard from './components/Pages/Dashboard'
import Transactions from './components/Pages/Transactions'
import Stock from './components/Pages/Stock'
import Error from './components/Pages/Error'
import Discover from './components/Pages/Discover';

/* Config file for page routings */
const pageConfig = {
  default: "Discover",
  error: "Error",
  ref: {
      "Login": Login,
      "Dashboard": Dashboard,
      "Transactions": Transactions,
      "Discover": Discover,
      "Stock": Stock,
      "Error": Error,
  },
}

export default function App() {
  
  const[currentPage, setCurrentPage] = useState(pageConfig.default)
  console.log("App: rendering " + currentPage);

  var Body = pageConfig.ref[pageConfig.error];
  if(pageConfig.ref.hasOwnProperty(currentPage)){
      Body = pageConfig.ref[currentPage];
  }

  return (

    <Container maxWidth='lg'>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} pageConfig={pageConfig.ref}/>
        <MuiPickersUtilsProvider  utils={MomentUtils}>
          <Body/>
        </MuiPickersUtilsProvider>
    </Container>

  );
}

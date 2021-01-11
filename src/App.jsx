import MomentUtils from '@date-io/moment';
import { Container } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
/* Page Components */
import Header from './components/Header';
import Dashboard from './components/Pages/Dashboard';
import Discover from './components/Pages/Discover';
import Error from './components/Pages/Error';
/* Page Body Options */
import Login from './components/Pages/Login';
import Stock from './components/Pages/Stock';
import Transactions from './components/Pages/Transactions';
import { useStickyState } from './components/Utils';



/* Config file for page routings */
const pageConfig = {
  default: "Transactions",
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

  const [currentPage, setCurrentPage] = useStickyState(pageConfig.default)
  console.log("Rendering App - currentPage: " + currentPage);

  var Body = pageConfig.ref[pageConfig.error];
  if (pageConfig.ref.hasOwnProperty(currentPage)) {
    Body = pageConfig.ref[currentPage];
  }

  return (

    <Container maxWidth='lg'>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} pageConfig={pageConfig.ref} />
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Body />
      </MuiPickersUtilsProvider>
    </Container>

  );
}

import {useState} from 'react'
import { Container } from '@material-ui/core'

/* Page Components */
import Header from './components/Header';

/* Page Body Options */
import Login from './components/Pages/Login'
import Dashboard from './components/Pages/Dashboard'
import Transactions from './components/Pages/Transactions'
import Stock from './components/Pages/Stock'
import Error from './components/Pages/Error'

/* Config file for page routings */
const pageConfig = {
  default: "Login",
  error: "Error",
  ref: {
      "Login": Login,
      "Dashboard": Dashboard,
      "Transactions": Transactions,
      "Stock": Stock,
      "Error": Error,
  },
}

function connect() {
  const {MongoClient} = require('mongodb');

  const url = 'mongodb://localhost:27017';

  const client = new MongoClient(url, {useUnifiedTopology: true});
  client.connect(function(err, client){
    var db = client.db("stocks");
  })
}

export default function App() {
  
  const[currentPage, setCurrentPage] = useState(pageConfig.default)
  connect();
  console.log("App: rendering " + currentPage);

  var Body = pageConfig.ref[pageConfig.error];
  if(pageConfig.ref.hasOwnProperty(currentPage)){
      Body = pageConfig.ref[currentPage];
  }

  return (

    <Container maxWidth='lg'>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        <Body/>
    </Container>

  );
}

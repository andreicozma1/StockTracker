import { Container, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
/* Page Components */
import Header from './components/Header';
import Dashboard from './components/Pages/Dashboard';
import Discover from './components/Pages/Discover';
import Transactions from './components/Pages/Transactions';
import { fetchSummary, useStickyState } from './components/Utils';

const axios = require("axios");


function TabPanel({ children, value, index, ...other }) {
  return (
    <div hidden={value !== index} {...other}>
      {
        value === index && (
          children
        )
      }
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

/* Config file for page routings */
const pageConfig = {
  default: "Transactions",
  error: "Error",
  ref: {
    0: {
      title: "Dashboard",
      component: Dashboard,
    },
    1: {
      title: "Transactions",
      component: Transactions,
    },
    2: {
      title: "Discover",
      component: Discover,
    },
  },
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function App() {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useStickyState(0, "currentPageA")
  const [menuItems, setMenuItems] = useState([])

  const [transactions, setTransactions] = useStickyState({}, "transactions");
  const [summary, setSummary] = useState({});

  console.log("Rendering App - currentPage: " + currentPage);

  const getSummary = async () => {
    var new_summary = fetchSummary(transactions);

    console.log("SUMMARY");
    console.log(new_summary)

    setSummary(new_summary);
  }


  useEffect(() => {
    getSummary();

  }, [transactions])


  return (

    <Container maxWidth='lg' className={classes.root}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} pageConfig={pageConfig} menuItems={menuItems} setMenuItems={setMenuItems} />

      {
        Object.keys(pageConfig.ref).map(function (key) {
          const page = pageConfig.ref[key]
          const Body = page.component;
          return <TabPanel value={currentPage} index={parseInt(key)} key={key}>
            <Body setMenuItems={setMenuItems} transactions={transactions} setTransactions={setTransactions} summary={summary} setSummary={setSummary} />
          </TabPanel>
        })
      }

    </Container>

  );
}

import { useState } from "react"
import MuiAlert from '@material-ui/lab/Alert';
import NewTransaction from "../Sections/NewTransactions";
import PastTransactions from "../Sections/PastTransactions";
import { Snackbar } from "@material-ui/core";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/* ID Must not be changed and be unique */
const transTypes = {
    "Buy": 1000,
    "Sell": 1005,
    "Split": 1010,
    "Div": 1015,
    "Fee": 1020,
};

function Transactions() {
    const [transactions, setTransactions] = useState({});
    const [showSnackBar, setShowSnackbar] = useState({
        severity: "info",
        message: ""
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar({
            severity: "info",
            message: ""
        });
    };

    const handleAddTrans = (transaction) => {
        console.log(transaction);
        if (transactions.hasOwnProperty(transaction.id)) {
            console.error("Transaction already exists");
            setShowSnackbar({
                severity: "error",
                message: "Error! Transaction already exists."
            })
        } else {
            console.log("Added new transaction!")
            const new_transactions = { ...transactions };
            new_transactions[transaction.id] = transaction;
            setTransactions(new_transactions);
        }
    }

    return (
        <div>
            <NewTransaction onClick={handleAddTrans} transTypes={transTypes} />
            <PastTransactions rows={Object.values(transactions)} />

            {
                showSnackBar.message !== "" &&
                <Snackbar open={showSnackBar.message !== ""} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={showSnackBar.severity}>
                        {showSnackBar.message}
                    </Alert>
                </Snackbar>
            }

        </div>
    )
}


export default Transactions;
import { Box, Snackbar } from "@material-ui/core";
import { Add, CloudUpload, DeleteForever } from "@material-ui/icons";
import MuiAlert from '@material-ui/lab/Alert';
import { useEffect, useState } from "react";
import DialogConfirm from "../Elements/DialogConfirm";
import DialogImportCSV from "../Elements/DialogImportCSV";
import DialogNewTransaction from "../Elements/DialogNewTransaction";
import PastTransactions from "../Sections/PastTransactions";
import { makeMenuItem } from "../Utils";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function Transactions({ setMenuItems, transactions, setTransactions }) {
    console.log("Rendering page Transactions");

    const [showSnackBar, setShowSnackbar] = useState({
        severity: "info",
        message: ""
    });

    const [showNewTransDialog, setShowNewTransDialog] = useState(false);
    const [showImportCSVDialog, setShowImportCSVDialog] = useState(false);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

    const [menuItems] = useState(
        [
            makeMenuItem("Add Transaction", <Add />, () => setShowNewTransDialog(true)),
            makeMenuItem("Import CSV", <CloudUpload />, () => setShowImportCSVDialog(true)),
            makeMenuItem("Delete All", <DeleteForever />, () => setShowDeleteAllDialog(true))
        ]
    )

    useEffect(() => {
        setMenuItems(menuItems);
    }, [menuItems, setMenuItems]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar({
            severity: "info",
            message: ""
        });
    };

    const handleAddTrans = (transaction, bulk) => {
        console.log("Adding new transaction")
        console.log(transaction);
        if (bulk) {
            setTransactions(transaction);
            return true;
        } else {

            if (transactions.hasOwnProperty(transaction.id)) {
                console.error("Transaction already exists");
                setShowSnackbar({
                    severity: "error",
                    message: "Error! Transaction already exists."
                })
                return false;
            } else {
                console.log("Added new transaction!")

                const new_transactions = { ...transactions };

                new_transactions[transaction.id] = transaction;
                setTransactions(new_transactions);

                setShowSnackbar({
                    severity: "success",
                    message: "Successfully added transaction!"
                })
            }
            return true;
        }
    }
    const onDeleteAll = () => {
        if (Object.keys(transactions).length !== 0) {
            setTransactions({})
            setShowSnackbar({
                severity: "success",
                message: "Deleted all transactions"
            })
        } else {
            setShowSnackbar({
                severity: "warning",
                message: "Transactions list alrady empty"
            })
        }

    }

    return (
        <Box>
            <PastTransactions rows={Object.values(transactions)} setTransactions={setTransactions} />

            <DialogNewTransaction open={showNewTransDialog} onClose={() => setShowNewTransDialog(false)} onInsert={handleAddTrans} />
            <DialogImportCSV open={showImportCSVDialog} onClose={() => setShowImportCSVDialog(false)} onInsertAll={(arr) => handleAddTrans(arr, true)} />
            <DialogConfirm open={showDeleteAllDialog} onClose={() => setShowDeleteAllDialog(false)} onConfirm={onDeleteAll} title="Delete all transactions?" message="Click 'Confirm' to permanently delete your past transactions. This action cannot be undone." />
            {
                showSnackBar.message !== "" &&
                <Snackbar open={showSnackBar.message !== ""} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={showSnackBar.severity}>
                        {showSnackBar.message}
                    </Alert>
                </Snackbar>
            }

        </Box>
    )
}
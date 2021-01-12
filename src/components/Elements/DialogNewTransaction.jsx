import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, makeStyles, Snackbar, Switch } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import { useState } from "react";
import { def_empty_transaction } from "../Defaults";
import NewTransaction from "../Sections/NewTransaction";
import { useStickyState } from "../Utils";


const useStyles = makeStyles((theme) => ({
    switch: {
        flexGrow: 1,
        marginLeft: theme.spacing(2)
    }
}))
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function DialogNewTransaction({ open, onInsert, onClose, ...props }) {

    const classes = useStyles();

    const [transaction, setTransaction] = useState(def_empty_transaction);
    const [closeOnInsert, setCloseOnInsert] = useStickyState(true);
    const [clearOnInsert, setClearOnInsert] = useStickyState(false);

    const [showSnackBar, setShowSnackbar] = useState({
        severity: "info",
        message: ""
    });

    const onCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar({
            severity: "info",
            message: ""
        });
    };


    const handleSubmit = () => {
        try {
            console.log("Clicked insert with transaction:")

            if (!transaction.date || !transaction.symbol || !transaction.type || !transaction.units || !transaction.price || !transaction.fees || !transaction.split)
                throw new Error("Invalid input")

            var new_trans = {
                ...transaction,
                symbol: transaction.symbol.symbol,
            };
            new_trans.id = new_trans.date.format() + "-" + new_trans.type + "-" + new_trans.symbol + "-" + new_trans.units + "-" + new_trans.price + "-" + new_trans.fees + "-" + new_trans.split;
            console.log(new_trans)

            if (onInsert(new_trans)) {
                if (closeOnInsert) onClose()
                if (clearOnInsert) handleClear()
            }

        } catch (error) {
            console.error("Invalid Single-Transaction field. Cannot add transaction")
            setShowSnackbar({
                severity: "warning",
                message: "Please fill all required fields correctly."
            })
        }
    }

    const handleClear = () => setTransaction(def_empty_transaction);


    return (
        <Dialog open={open} {...props}>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogContent>
                <NewTransaction transaction={transaction} setTransaction={setTransaction} />
            </DialogContent>
            <DialogActions>
                <div className={classes.switch}>
                    <FormControlLabel
                        control={<Switch color="primary" checked={closeOnInsert} onChange={(event) => setCloseOnInsert(event.target.checked)} />}
                        label="Autoclose"
                    />
                    <FormControlLabel
                        control={<Switch color="primary" checked={clearOnInsert} onChange={(event) => setClearOnInsert(event.target.checked)} />}
                        label="Autoclear"
                    />
                </div>

                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleClear}>Clear</Button>
                <Button onClick={handleSubmit} autoFocus>Insert</Button>
            </DialogActions>

            {
                showSnackBar.message !== "" &&
                <Snackbar open={showSnackBar.message !== ""} autoHideDuration={3000} onClose={onCloseSnackbar}>
                    <Alert onClose={onCloseSnackbar} severity={showSnackBar.severity}>
                        {showSnackBar.message}
                    </Alert>
                </Snackbar>
            }
        </Dialog>
    )
}

DialogNewTransaction.propTypes = {
    open: PropTypes.bool.isRequired,
    onInsert: PropTypes.func.isRequired,
}
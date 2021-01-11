
import { Button, ButtonGroup, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, Snackbar, TextField, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import MuiAlert from '@material-ui/lab/Alert';
import { DateTimePicker } from "@material-ui/pickers";
import { useState } from "react";
import TransactionImporter from "../Elements/TransactionImporter";
import SearchStocks from "./SearchStocks";

const useStyles = makeStyles((theme) => ({
    inputDatePicker: {
        minWidth: 100,
        width: "100%"
    },
    inputSelector: {
        minWidth: 75,
        width: "100%"
    },
    inputSubmit: {
        width: "100%",
        textAlign: "center",
        margin: theme.spacing(2, 0)
    },

    card: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(1)
    },

    transactionForm: {
        margin: theme.spacing(2, 0, 1),
    }
}))

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function NewTransaction({ onClick, transTypes }) {
    const classes = useStyles();

    const [transDate, transDateSet] = useState(new Date());
    const [transType, transTypeSet] = useState(transTypes["Buy"]);
    const [transTicker, transTickerSet] = useState(null);
    const [transUnits, transUnitsSet] = useState("");
    const [transPrice, transPriceSet] = useState("");
    const [transFees, transFeesSet] = useState("");
    const [transSplit, transSplitSet] = useState("");

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

    const handleSubmit = () => {
        try {
            const id = transDate.getFullYear() + "-" + (transDate.getMonth() + 1) + "-" + transDate.getHours() + "-" + transDate.getMinutes() + "-" + transType + "-" + transTicker.symbol + "-" + transUnits + "-" + transPrice + "-" + transFees + "-" + transSplit;
            onClick({
                id: id,
                date: transDate,
                type: transType,
                ticker: transTicker.symbol,
                units: transUnits,
                price: transPrice,
                fees: transFees,
                split: transSplit
            });
        } catch (error) {
            console.error("Invalid Single-Transaction field. Cannot add transaction")
            setShowSnackbar({
                severity: "warning",
                message: "Please fill all required fields."
            });
        }

    }

    return (
        <Paper className={classes.card}>
            <Typography variant="h5" color="primary">New Transaction</Typography>
            <form className={classes.transactionForm}>
                <Grid container spacing={1} justify="center">

                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <DateTimePicker className={classes.inputDatePicker} label="Date" inputVariant="outlined" value={transDate} onChange={transDateSet} />
                    </Grid>

                    <Grid item xs={8} sm={4} md={4} lg={3}>
                        <SearchStocks onChange={(event, value) => transTickerSet(value)} label="Stock Symbol" value={transTicker} />
                    </Grid>

                    <Grid item xs={4} sm={2} md={3} lg={2}>
                        <FormControl required className={classes.inputSelector}>
                            <InputLabel id="label-ticker">Type</InputLabel>
                            <Select variant="outlined" value={transType} onChange={(e) => transTypeSet(e.target.value)} >
                                {
                                    Object.keys(transTypes).map((trans_name) => {
                                        const transId = transTypes[trans_name];
                                        return <MenuItem key={transId} value={transId}>{trans_name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={3} md={3} lg={2}>
                        <TextField required label="Asset Amount" type="number" variant="outlined" value={transUnits} onChange={(e) => transUnitsSet(e.target.value)} />
                    </Grid>

                    <Grid item xs={6} sm={3} md={3} lg={2}>
                        <TextField required label="Asset Price" type="number" variant="outlined" value={transPrice} onChange={(e) => transPriceSet(e.target.value)} />
                    </Grid>

                    <Grid item xs={6} sm={3} md={3} lg={2}>
                        <TextField required label="Fees" type="number" variant="outlined" value={transFees} onChange={(e) => transFeesSet(e.target.value)} />
                    </Grid>
                    <Grid item xs={6} sm={3} md={3} lg={2}>
                        <TextField required label="Stock Split Ratio" type="number" variant="outlined" value={transSplit} onChange={(e) => transSplitSet(e.target.value)} />
                    </Grid>

                </Grid>
                <div className={classes.inputSubmit}>
                    <ButtonGroup variant="contained" color="secondary">
                        <Button onClick={handleSubmit} startIcon={<Add />}>Add Transaction</Button>

                        <TransactionImporter onResult={onClick} />

                    </ButtonGroup>


                </div>

            </form>


            {
                showSnackBar.message !== "" &&
                <Snackbar open={showSnackBar.message !== ""} autoHideDuration={12000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={showSnackBar.severity}>
                        {showSnackBar.message}
                    </Alert>
                </Snackbar>
            }

        </Paper>
    )
}
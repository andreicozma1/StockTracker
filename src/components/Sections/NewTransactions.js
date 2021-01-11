
import { TextField, makeStyles, Grid, Paper, Button, MenuItem, Select, FormControl, InputLabel, Typography, ButtonGroup, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar } from "@material-ui/core"
import { Add, CloudUpload, Remove } from "@material-ui/icons"
import { useState, createRef } from "react"
import { DateTimePicker } from "@material-ui/pickers";
import SearchStocks from "./SearchStocks";
import { CSVReader } from 'react-papaparse'
import { Autocomplete } from "@material-ui/lab";
import MuiAlert from '@material-ui/lab/Alert';
import TransactionImporter from "../Elements/TransactionImporter";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        justifyContents: "center",
    },
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
        '& .MuiTextField-root': {
            minWidth: 100,
            width: "100%"
        },
    }
}))

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const buttonRef = createRef();

export default function NewTransaction({ onClick, transTypes }) {
    const classes = useStyles();

    const [transDate, transDateSet] = useState(new Date());
    const [transType, transTypeSet] = useState(transTypes["Buy"]);
    const [transTicker, transTickerSet] = useState(null);
    const [transUnits, transUnitsSet] = useState("");
    const [transPrice, transPriceSet] = useState("");
    const [transFees, transFeesSet] = useState("");
    const [transSplit, transSplitSet] = useState("");

    const [fileContents, fileContentsSet] = useState(null);

    const [importer, importerSet] = useState({
        xtransDate: "",
        xtransType: "",
        xtransTicker: "",
        xtransUnits: "",
        xtransPrice: "",
        xtransFees: "",
        xtransSplit: ""
    })


    const [import_status, import_status_set] = useState({
        finished: false,
        invalid_rows: 0,
        error_rows: 0,
        success_rows: 0,
        nonstock_rows: 0,
    });

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

    const handleFileLoad = (data) => {
        console.log(data);

        if (data.length > 0) {
            const sample = data[0].data;
        } else {
            console.error("File is empty");
        }

        fileContentsSet(data)
    }

    const handleFileError = (err, file, inputElem, reason) => {
        setShowSnackbar({
            severity: "error",
            message: "Error occured while uploading file: " + reason
        });
        console.log(err);
        console.log(file);
        console.log(inputElem);
        console.log(reason);
    }

    const handleOpenButton = (elem) => {
        console.log("Open button")
        if (buttonRef.current) {
            buttonRef.current.open(elem);
        }
    }

    const handleRemoveButton = (elem) => {
        console.log("Remove button")
        if (buttonRef.current) {
            buttonRef.current.removeFile(elem)
            import_status_set({
                finished: false
            })
            importerSet({
                xtransDate: "",
                xtransType: "",
                xtransTicker: "",
                xtransUnits: "",
                xtransPrice: "",
                xtransFees: "",
                xtransSplit: ""
            })
        }
    }

    const handleUploadTransactions = () => {
        console.log("Uploading transactions")
        console.log(importer.xtransDate + " -  importer.xtransDateSet")
        console.log(importer.xtransType + " -  importer.xtransTypeSet")
        console.log(importer.xtransTicker + " -  importer.xtransTickerSet")
        console.log(importer.xtransUnits + " -  importer.xtransUnitsSet")
        console.log(importer.xtransPrice + " -  importer.xtransPriceSet")
        console.log(importer.xtransFees + " -  importer.xtransFeesSet")
        console.log(importer.xtransSplit + " -  importer.xtransSplitSet")

        if (import_status.finished) {
            import_status_set({
                finished: false
            })
            onClick({}, true);

            return
        }

        var valid_row_cell_ct = 5 + (importer.xtransSplit === "" ? 0 : 1) + (importer.xtransFees === "" ? 0 : 1);
        var invalid_rows = 0;
        var error_rows = 0;
        var success_rows = 0;
        var nonstock_rows = 0;

        var transactions_obj = {};

        for (var index in fileContents) {
            const row = fileContents[index].data

            // console.log(row);
            if (row.length > valid_row_cell_ct) {
                try {
                    var dtransDate = new Date(Date.parse(row[importer.xtransDate]));
                    var dtransType = row[importer.xtransType];
                    var dtransTicker = row[importer.xtransTicker];
                    var dtransUnits = Number((row[importer.xtransUnits]).replace(/[^0-9.-]+/g, ""));
                    var dtransPrice = Number((row[importer.xtransPrice]).replace(/[^0-9.-]+/g, ""));
                    var dtransFees = importer.xtransFees === "" ? 0 : Number((row[importer.xtransFees]).replace(/[^0-9.-]+/g, ""));
                    var dtransSplit = importer.xtransSplit === "" ? 1 : Number((row[importer.xtransSplit]).replace(/[^0-9.-]+/g, ""));

                    if (!dtransDate || !dtransType || !dtransTicker || !dtransUnits || !dtransPrice) {
                        nonstock_rows++;
                        continue;
                    }

                    const id = dtransDate.getFullYear() + "-" + (dtransDate.getMonth() + 1) + "-" + dtransDate.getHours() + "-" + dtransDate.getMinutes() + "-" + dtransType + "-" + dtransTicker + "-" + dtransUnits + "-" + dtransPrice + "-" + dtransFees + "-" + dtransSplit;

                    const resultobj = {
                        id: id,
                        date: dtransDate,
                        type: dtransType,
                        ticker: dtransTicker,
                        units: dtransUnits,
                        price: dtransPrice,
                        fees: dtransFees,
                        split: dtransSplit
                    };
                    // console.log(resultobj);
                    success_rows++;

                    transactions_obj[id] = resultobj
                } catch (error) {
                    console.log(error);
                    error_rows++;
                }

            } else {
                invalid_rows++;
            }

        }


        import_status_set({
            finished: true,
            invalid_rows: invalid_rows,
            error_rows: error_rows,
            success_rows: success_rows,
            nonstock_rows: nonstock_rows
        })


        // TODO Add snackbar with warning message

        if (invalid_rows > 0 && error_rows > 0) {
            console.error("Omitted " + invalid_rows + " rows with less than " + valid_row_cell_ct + " required cells");
            console.error("Omitted " + error_rows + " rows with missing/erroneous values");
            setShowSnackbar({
                severity: "error",
                message: "Omitted " + error_rows + " rows with missing/erroneous values and " + invalid_rows + " rows with less than " + valid_row_cell_ct + " required cells."
            })
        } else if (error_rows > 0) {
            console.error("Omitted " + error_rows + " rows with missing/erroneous values");
            setShowSnackbar({
                severity: "warning",
                message: "Omitted " + error_rows + " rows with missing/erroneous values"
            })
        } else if (invalid_rows > 0) {
            console.warn("Omitted " + invalid_rows + " rows with less than " + valid_row_cell_ct + " required cells");
            setShowSnackbar({
                severity: "warning",
                message: "Omitted " + invalid_rows + " rows with less than " + valid_row_cell_ct + " required cells"
            })
        } else {
            console.log("Successfully imported " + success_rows + " rows");
            setShowSnackbar({
                severity: "success",
                message: "Successfully imported " + success_rows + " rows"
            })
        }

        onClick(transactions_obj, true);
    }

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
                        <SearchStocks onChange={(event, value) => transTickerSet(value)} value={transTicker} />
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
                    <Button variant="contained" color="secondary" onClick={handleSubmit} startIcon={<Add />}>Add Transaction</Button>
                </div>
                
            </form>

            <TransactionImporter onFindStock={onClick}/>

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
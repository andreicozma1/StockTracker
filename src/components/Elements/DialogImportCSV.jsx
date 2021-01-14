import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, Snackbar, Tooltip } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import { createRef, useState } from "react";
import { CSVReader } from 'react-papaparse';
const useStyles = makeStyles((theme) => ({
    switch: {
        marginBottom: theme.spacing(2)
    },
    inputSelector: {
        minWidth: 75,
        width: "100%"
    },
}))
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const buttonRef = createRef();

export default function DialogImportCSV({ open, onInsertAll, onClose, ...props }) {

    const classes = useStyles();
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

    const onCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar({
            severity: "info",
            message: ""
        });
    };

    const onFileError = (err, file, inputElem, reason) => {
        setShowSnackbar({
            severity: "error",
            message: "Error occured while uploading file: " + reason
        });
        console.log(err);
        console.log(file);
        console.log(inputElem);
        console.log(reason);
    }

    const handleOpenFile = (elem) => {
        console.log("Open button")
        if (buttonRef.current) {
            buttonRef.current.open(elem);
        }
    }

    const handleRemoveFile = (elem) => {
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
            onClose();
        }
    }


    const handleUploadTransactions = () => {
        console.log("Attempting to import transactions. Selected matching field indices:")
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
            onInsertAll({});

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
                    var dtransUnits = (row[importer.xtransUnits]).replace(/[^0-9.-]+/g, "");
                    var dtransPrice = (row[importer.xtransPrice]).replace(/[^0-9.-]+/g, "");
                    var dtransFees = importer.xtransFees === "" ? 0 : Number((row[importer.xtransFees]).replace(/[^0-9.-]+/g, ""));
                    var dtransSplit = importer.xtransSplit === "" ? 1 : Number((row[importer.xtransSplit]).replace(/[^0-9.-]+/g, ""));

                    if (!dtransDate || !dtransType || !dtransTicker || !dtransUnits || !dtransPrice) {
                        console.log(dtransDate);
                        console.log(dtransType);
                        console.log(dtransTicker);
                        console.log(dtransUnits);
                        console.log(dtransPrice);
                        console.log(dtransFees);
                        console.log(dtransSplit);

                        nonstock_rows++;
                        continue;
                    }

                    const new_trans = {
                        date: dtransDate,
                        type: dtransType,
                        symbol: dtransTicker,
                        units: parseFloat(dtransUnits),
                        price: parseFloat(dtransPrice),
                        fees: dtransFees,
                        split: dtransSplit
                    };

                    new_trans.id = dtransDate.getFullYear() + "-" + (dtransDate.getMonth() + 1) + "-" + (dtransDate.getDate()) + "-" + dtransDate.getHours() + "-" + dtransDate.getMinutes() + "-" + dtransType + "-" + dtransTicker + "-" + dtransUnits + "-" + dtransPrice + "-" + dtransFees + "-" + dtransSplit;

                    // console.log(resultobj);
                    success_rows++;

                    transactions_obj[new_trans.id] = new_trans
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

        console.log("Success: " + success_rows + " ; nonstock: " + nonstock_rows)
        if (success_rows > 0)
            onInsertAll(transactions_obj);
    }


    return (
        <Dialog open={open} {...props}>
            <DialogTitle>Import CSV</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This action will replace all your past transactions with all valid stock transactions found in this file.
                </DialogContentText>

                <CSVReader
                    ref={buttonRef} noProgressBar onFileLoad={(data) => { fileContentsSet(data); console.log(data) }} onError={onFileError} noclick nodrag onRemoveFile={() => fileContentsSet(null)} dynamicTyping>

                    {({ file }) => (

                        <Tooltip title="Import from CSV" arrow placement="right">
                            <Button variant="contained" className={classes.switch}
                                onClick={handleOpenFile} startIcon={<CloudUpload />} color="primary">
                                {file ? file.name : "Upload File"}
                            </Button>
                        </Tooltip>


                    )}
                </CSVReader>
                {
                    fileContents && <div>


                        {
                            import_status.finished ? <div>
                                <DialogContentText>
                                    Stocks imported: {import_status.success_rows + " " + (import_status.success_rows !== 1 ? "rows" : "row")}
                                </DialogContentText>
                                <DialogContentText>
                                    Non-stock rows: {import_status.nonstock_rows + " " + (import_status.nonstock_rows !== 1 ? "rows" : "row")}
                                </DialogContentText>
                                <DialogContentText>
                                    Error occured: {import_status.error_rows + " " + (import_status.error_rows !== 1 ? "rows" : "row")}
                                </DialogContentText>
                                <DialogContentText>
                                    Invalid row cell count: {import_status.invalid_rows + " " + (import_status.invalid_rows !== 1 ? "rows" : "row")}
                                </DialogContentText>
                            </div> : <div>
                                    <DialogContentText>
                                        Match the required fields below with the corresponding ones from the file.
                                            </DialogContentText>
                                    <DialogContentText>
                                        Hint: If left blank, assumed Fee ($0 - no fee) and Split Ratio (1 - no split).
                                            </DialogContentText>
                                    <Grid container spacing={1} direction="column">
                                        <Grid item>
                                            <FormControl className={classes.inputSelector} required>
                                                <InputLabel>Transaction Date</InputLabel>
                                                <Select variant="outlined" value={importer.xtransDate} onChange={(e) => importerSet({ ...importer, xtransDate: e.target.value })}>
                                                    <MenuItem value="" disabled>
                                                        Transaction Date Field
                                                    </MenuItem>
                                                    {
                                                        Object.values(fileContents[0].data).map((option, index) => {
                                                            return (Object.values(importer).includes(index) && index !== importer.xtransDate) ? null : <MenuItem key={index} value={index}>{option}</MenuItem>
                                                        })
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item>

                                            <FormControl className={classes.inputSelector} required>
                                                <InputLabel>Asset Symbol</InputLabel>
                                                <Select variant="outlined" value={importer.xtransTicker} onChange={(e) => importerSet({ ...importer, xtransTicker: e.target.value })}>
                                                    <MenuItem value="" disabled>
                                                        Stock Symbol Field
                                                    </MenuItem>
                                                    {
                                                        Object.values(fileContents[0].data).map((option, index) => {
                                                            return (Object.values(importer).includes(index) && index !== importer.xtransTicker) ? null : <MenuItem key={index} value={index}>{option}</MenuItem>
                                                        })
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Grid>



                                        <Grid item >
                                            <FormControl className={classes.inputSelector} required>
                                                <InputLabel>Transaction Type</InputLabel>
                                                <Select variant="outlined" value={importer.xtransType} onChange={(e) => { importerSet({ ...importer, xtransType: e.target.value }) }}>
                                                    <MenuItem value="" disabled>
                                                        Transaction Type Field
                                                    </MenuItem>
                                                    {
                                                        Object.values(fileContents[0].data).map((option, index) => {
                                                            return (Object.values(importer).includes(index) && index !== importer.xtransType) ? null : <MenuItem key={index} value={index}>{option}</MenuItem>
                                                        })
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Grid>




                                        <Grid item>

                                            <FormControl className={classes.inputSelector} required>
                                                <InputLabel>Transacted Asset Units</InputLabel>
                                                <Select variant="outlined" value={importer.xtransUnits} onChange={(e) => importerSet({ ...importer, xtransUnits: e.target.value })}>
                                                    <MenuItem value="" disabled>
                                                        Transacted Units Field
                                                    </MenuItem>
                                                    {
                                                        Object.values(fileContents[0].data).map((option, index) => {
                                                            return (Object.values(importer).includes(index) && index !== importer.xtransUnits) ? null : <MenuItem key={index} value={index}>{option}</MenuItem>
                                                        })
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Grid>


                                        <Grid item>

                                            <FormControl className={classes.inputSelector} required>
                                                <InputLabel>Asset Price</InputLabel>
                                                <Select variant="outlined" value={importer.xtransPrice} onChange={(e) => importerSet({ ...importer, xtransPrice: e.target.value })}>
                                                    <MenuItem value="" disabled>
                                                        Asset Price Field
                                                    </MenuItem>
                                                    {
                                                        Object.values(fileContents[0].data).map((option, index) => {
                                                            return (Object.values(importer).includes(index) && index !== importer.xtransPrice) ? null : <MenuItem key={index} value={index}>{option}</MenuItem>
                                                        })
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Grid>


                                        <Grid item>

                                            <FormControl className={classes.inputSelector}>
                                                <InputLabel>Transaction Fees</InputLabel>
                                                <Select variant="outlined" value={importer.xtransFees} onChange={(e) => importerSet({ ...importer, xtransFees: e.target.value })}>
                                                    <MenuItem value="">
                                                        Omit (assume 0)
                                                    </MenuItem>
                                                    {
                                                        Object.values(fileContents[0].data).map((option, index) => {
                                                            return (Object.values(importer).includes(index) && index !== importer.xtransFees) ? null : <MenuItem key={index} value={index}>{option}</MenuItem>
                                                        })
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Grid>


                                        <Grid item>

                                            <FormControl className={classes.inputSelector}>
                                                <InputLabel>Stock Split Ratio</InputLabel>
                                                <Select variant="outlined" value={importer.xtransSplit} onChange={(e) => importerSet({ ...importer, xtransSplit: e.target.value })}>
                                                    <MenuItem value="">
                                                        Omit (assume 1)
                                                    </MenuItem>
                                                    {
                                                        Object.values(fileContents[0].data).map((option, index) => {
                                                            return (Object.values(importer).includes(index) && index !== importer.xtransSplit) ? null : <MenuItem key={index} value={index}>{option}</MenuItem>
                                                        })
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                </div>
                        }
                    </div>
                }

            </DialogContent>
            <DialogActions>
                <Tooltip title="Cancel import" arrow placement="top-end">
                    <Button onClick={handleRemoveFile} color="primary">Close</Button>
                </Tooltip>
                <Tooltip title="Replace portfolio" arrow placement="top-end">
                    <Button onClick={handleUploadTransactions} color="primary">{import_status.finished ? "Clear & Retry" : "Import"}</Button>

                </Tooltip>
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

DialogImportCSV.propTypes = {
    open: PropTypes.bool.isRequired,
    onInsertAll: PropTypes.func.isRequired,
}
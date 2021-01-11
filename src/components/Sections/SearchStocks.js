import { useState } from "react"
import { Autocomplete } from "@material-ui/lab"
import MuiAlert from '@material-ui/lab/Alert';
import { TextField, Snackbar } from "@material-ui/core";
const axios = require("axios");

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function compare(a, b) {
    if (a.description < b.description)
        return -1;
    if (a.description > b.description)
        return 1;
    return 0;
}

function logError(error) {
    if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
}

var timer = null;

export default function SearchStocks(props) {
    const [stockList, stockListSet] = useState([])
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

    const handleChange = async function (e) {
        const text = e.target.value;

        if (timer) {
            console.error("timer started");
            clearTimeout(timer);
            timer = null;
        }
        stockListSet([])
        timer = setTimeout(function () {
            console.log("Searching for " + text);
            axios.get('https://finnhub.io/api/v1/search', {
                params: {
                    q: encodeURIComponent(text),
                    token: process.env.REACT_APP_FINNHUB_KEY
                }
            }).then(resp => {
                const result_arr = resp.data.result;
                result_arr.sort(compare)
                console.log("Got result of length " + result_arr.length)
                stockListSet(result_arr);
            }).catch(error => {
                logError(error);
                setShowSnackbar({
                    severity: "error",
                    message: error.message
                })
            })
        }, 500);


    }


    return (
        <div>

            <Autocomplete
                {...props}
                filterSelectedOptions
                clearOnEscape
                options={stockList}
                groupBy={(option) => option.description}
                getOptionLabel={(option) => option.displaySymbol + "  -  " + option.description}
                loading={stockList.length === 0 || timer !== null}
                renderInput={(params) => <TextField {...params} onChange={handleChange} label="Stock Search" variant="outlined" />}
            >
            </Autocomplete>
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
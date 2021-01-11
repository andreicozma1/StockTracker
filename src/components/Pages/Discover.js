import { useState } from "react"
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles, Snackbar, LinearProgress, Grid } from "@material-ui/core";
import StockCard from "../Sections/StockCard";
import SearchStocks from "../Sections/SearchStocks";
import {useStickyState} from "../Utils";

const axios = require("axios");

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1, 0),
    },
}))

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

export default function Discover() {
    console.log("Discover");

    const classes = useStyles()
    const [autocompleteValues, setAutocompleteValues] = useStickyState([], "autocompleteValues")
    const [cards, setCards] = useStickyState({}, "cards");
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

    const onSelect = async function (event, selected_arr) {
        console.log("Selected")
        console.log(selected_arr);

        setAutocompleteValues(selected_arr);

        var new_cards = {};
        if (selected_arr.length < Object.keys(cards).length) {
            console.log(cards);
            for (var stock_index in selected_arr) {
                const stock = selected_arr[stock_index];
                if (cards.hasOwnProperty(stock.symbol))
                    new_cards[stock.symbol] = cards[stock.symbol];
            }
            setCards(new_cards);
            return;
        }

        for (var index in selected_arr) {

            const stock = selected_arr[index]
            console.log(stock);
            if (cards.hasOwnProperty(stock.symbol)) {
                new_cards[stock.symbol] = cards[stock.symbol];
                continue;
            }
            axios.get('https://finnhub.io/api/v1/stock/profile2', {
                params: {
                    symbol: encodeURIComponent(stock.symbol),
                    token: process.env.REACT_APP_FINNHUB_KEY
                }
            }).then(result => {
                console.log("Got profile for " + stock.symbol)
                console.log(result);
                var profile = result.data;

                if (cards.hasOwnProperty(profile.ticker)) {
                    setShowSnackbar({
                        severity: "warning",
                        message: "Warning! Global market not supported. Profile returned the same result as " + cards[profile.ticker].ticker
                    })

                    setAutocompleteValues(autocompleteValues.filter(item => item.symbol !== stock.symbol));

                    return;
                }

                // Attempt to get US Stock Quotes
                axios.get('https://finnhub.io/api/v1/quote', {
                    params: {
                        symbol: encodeURIComponent(profile.ticker),
                        token: process.env.REACT_APP_FINNHUB_KEY
                    }
                }).then(result => {
                    // On success
                    console.log("Got stock quote for " + profile.ticker)
                    console.log(result);

                    var quote = result.data;
                    profile["quote"] = quote;
                    new_cards[profile.ticker] = profile;
                    setCards(new_cards);

                }).catch(error => {
                    // On fail
                    logError(error);

                    console.warn("Quotes not available in Global Market. Attempting to get U.S. Stock quotes.")
                    // Backup use ticker to get US Quotes instad
                    axios.get('https://finnhub.io/api/v1/quote', {
                        params: {
                            symbol: encodeURIComponent(profile.ticker),
                            token: process.env.REACT_APP_FINNHUB_KEY
                        }
                    }).then(result => {
                        setShowSnackbar({
                            severity: "info",
                            message: "Info! Showing U.S. Market Quotes."
                        })
                        var quote = result.data;
                        quote["backup"] = true;
                        profile["quote"] = quote;
                        new_cards[profile.ticker] = profile;
                        setCards(new_cards);

                    }).catch(error => {
                        logError(error);
                        setShowSnackbar({
                            severity: "warning",
                            message: "Warning! Global Market Quotes are not available."
                        })
                        console.error("Failed to get backup stock quotes");
                        var quote = {
                            pc: null,
                            o: null,
                            h: null,
                            l: null,
                            c: null,
                        }
                        profile["quote"] = quote;
                        new_cards[profile.ticker] = profile;
                        setCards(new_cards);
                    })
                })

            }).catch(error => {
                // On FAIL get stock
                logError(error);
                setShowSnackbar({
                    severity: "error",
                    message: "Error! Failed to get stock data."
                })
            })
        }
    }

    const handleCardClose = (ticker) => {
        console.log("Deleting card " + ticker);
        const new_cards = { ...cards };
        delete new_cards[ticker]
        setCards(new_cards);
        setAutocompleteValues(autocompleteValues.filter(item => item.symbol !== ticker));
        console.log(cards)
    }


    return (
        <div>
            {
                autocompleteValues.length !== Object.keys(cards).length && <LinearProgress color="secondary" />
            }
            <div className={classes.margin}>
                <SearchStocks onChange={onSelect} value={autocompleteValues} multiple />
            </div>

            <Grid container spacing={1} >
                {
                    Object.values(cards).map((card) => {
                        console.log("Rendering");
                        console.log(card);
                        return <Grid item md={6} key={card.country + "-" + card.currency + "-" + card.ticker} >
                            <StockCard info={card} onClose={() => handleCardClose(card.ticker)} />
                        </Grid>
                    })
                }
            </Grid>

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


import { Button, CircularProgress, Grid, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";

const axios = require("axios");


const useStyles = makeStyles((theme) => ({
    root: {

    },
    retryButton: {
        width: "100%",
    }
}))


export default function Peers(props) {
    const classes = useStyles()

    const [data, setData] = useState([]);

    const refresh = function () {

        console.info("refresh: Fetching fresh Peers data for " + props.ticker);

        axios.get('https://finnhub.io/api/v1/stock/peers', {
            params: {
                symbol: props.ticker,
                token: process.env.REACT_APP_FINNHUB_KEY
            }
        }).then(result => {
            console.info("refresh: Got Peers data for " + props.ticker);
            console.log(result)
            setData(result.data)
        })

    }
    useEffect(refresh, [props.ticker]);

    const makeRetryBtn = () => {
        return <Button
            variant="contained"
            color="secondary"
            onClick={refresh}
            startIcon={
                <CircularProgress size={20} color="inherit" />
            }>
            RELOAD
        </Button>
    }

    const makePeerItem = (ticker) => {
        if (ticker === props.ticker)
            return null

        return <Grid item xs={4} lg={3} key={ticker}>
            <Button variant="outlined" color="secondary" className={classes.retryButton}>{ticker}</Button>
        </Grid>
    }

    return (
        <Grid container justify="space-around" alignItems="center">

            <Grid item xs={2}>
                <Typography variant="subtitle2">PEERS</Typography>
            </Grid>
            <Grid container item xs={10} spacing={1} className={classes.root} justify="flex-end" alignItems="center">
                {
                    (data.length === 0) ? makeRetryBtn() : data.map((ticker) => {
                        return makePeerItem(ticker)
                    })
                }
            </Grid>
        </Grid>

    )
}
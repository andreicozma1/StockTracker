
import { Grid, makeStyles, Button, CircularProgress, Typography } from "@material-ui/core";
import { useState } from "react"

const axios = require("axios");
const finnhubkey = "bvt0qjf48v6rku8bl5u0";


const useStyles = makeStyles((theme) => ({
    root: {

    },
    retryButton: {
        width: "100%",
    }
}))


export default function Peers(props) {
    const classes = useStyles()

    const [peers, setPeers] = useState([]);

    const getPeers = async function () {

        console.log("Updating peers for " + props.ticker);
        if (peers.length === 0) {
            axios.get('https://finnhub.io/api/v1/stock/peers', {
                params: {
                    symbol: props.ticker,
                    token: finnhubkey
                }
            }).then(result => {
                setPeers(result.data)
            })
        } else {
            console.warn("Shall not update peers for " + props.ticker)
        }
    }

    const makeRetryBtn = () => {
        return <Button
            variant="contained"
            color="secondary"
            onClick={getPeers}
            startIcon={
                <CircularProgress size={20} color="snow" />
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
                    (peers.length === 0) ? makeRetryBtn() : peers.map((ticker) => {
                        return makePeerItem(ticker)
                    })
                }
            </Grid>
        </Grid>

    )
}
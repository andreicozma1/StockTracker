
import { Grid, makeStyles, Button, CircularProgress, Typography, Divider, Paper } from "@material-ui/core";
import { useState } from "react";
import RecommTrendSection from "./RecommTrendSection";

const axios = require("axios");
const finnhubkey = "bvt0qjf48v6rku8bl5u0";


const useStyles = makeStyles((theme) => ({
    root: {

    },
    retryButton: {
        width: "100%",
    }
}))


export default function RecommendationTrend(props) {
    const classes = useStyles()

    const [peers, setPeers] = useState(null);

    const getPeers = async function () {

        console.log("Updating peers for " + props.ticker);
        if (peers === null) {
            axios.get('https://finnhub.io/api/v1/stock/recommendation', {
                params: {
                    symbol: props.ticker,
                    token: finnhubkey
                }
            }).then(result => {
                console.log(result.data)
                setPeers(result.data)
            })
        } else {
            console.warn("Shall not update peers for " + props.ticker)
        }
    }
   

    return (
        peers == null ? <Grid container justify="space-around" alignItems="center">
            <Grid item xs={4}>
                <Typography variant="h6">Recommendation Trends</Typography>
            </Grid>
            
            <Grid container item xs={8} spacing={1} className={classes.root} justify="flex-end" alignItems="center">
                <Button
                variant="contained"
                color="secondary"
                onClick={getPeers}
                startIcon={
                    <CircularProgress size={20} color="snow" />
                }>
                RELOAD
                </Button>
            </Grid>
        </Grid> : <Grid container justify="space-around" alignItems="center">
                <Grid item xs={2}>
                    <Typography variant="h6">Average</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="h6">Articles</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="h6">Articles</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="h6">Articles</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="h6">Articles</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="h6">Articles</Typography>
                </Grid>
                {
                    peers.map(value => {
                        return <RecommTrendSection key={value.symbol+"-"+value.period} jsonval={value} divider/>
                    })
                }

        </Grid>
    )
}
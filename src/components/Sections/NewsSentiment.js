
import { Grid, makeStyles, Button, CircularProgress, Typography } from "@material-ui/core";
import { useState } from "react"

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
    retryButton: {
        width: "100%",
    }
}))


export default function NewsSentiment(props) {
    const classes = useStyles()

    const [peers, setPeers] = useState(null);

    const getPeers = async function () {

        console.log("Updating peers for " + props.ticker);
        if (peers === null) {
            axios.get('https://finnhub.io/api/v1/news-sentiment', {
                params: {
                    symbol: props.ticker,
                    token: process.env.REACT_APP_FINNHUB_KEY
                }
            }).then(result => {
                setPeers(result.data)
            })
        } else {
            console.warn("Shall not update peers for " + props.ticker)
        }
    }

    return (
        peers == null ? <Grid container justify="space-around" alignItems="center">

            <Grid item xs={4}>
                <Typography variant="subtitle2">NEWS SENTIMENT</Typography>
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
                    <Typography variant="subtitle2">ARTICLES</Typography>
                </Grid>

                <Grid container item xs={5} direction="column" alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">This Week</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="secondary">{peers.buzz.articlesInLastWeek}</Typography>
                    </Grid>
                </Grid>

                <Grid container item xs={5} direction="column" alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">Weekly Average</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="secondary">{peers.buzz.weeklyAverage}</Typography>
                    </Grid>
                </Grid>

                <Grid item xs={2}>
                    <Typography variant="subtitle2">NEWS</Typography>
                </Grid>

                <Grid container item xs={5} direction="column" alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">Buzz</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="secondary">{(peers.buzz.buzz * 100).toFixed(2)}%</Typography>

                    </Grid>
                </Grid>

                <Grid container item xs={5} direction="column" alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">News Score</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="secondary">{(peers.companyNewsScore * 100).toFixed(2)}%</Typography>
                    </Grid>
                </Grid>


                <Grid item xs={2}>
                    <Typography variant="subtitle2">SECTOR</Typography>
                </Grid>


                <Grid container item xs={5} direction="column" alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">Bullish</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="secondary">{(peers.sectorAverageBullishPercent * 100).toFixed(2)}%</Typography>
                    </Grid>
                </Grid>

                <Grid container item xs={5} direction="column" alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">News Score</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="secondary">{(peers.sectorAverageNewsScore * 100).toFixed(2)}%</Typography>
                    </Grid>
                </Grid>

                <Grid item xs={2}>
                    <Typography variant="subtitle2">SENTIMENT</Typography>
                </Grid>

                <Grid container item xs={5} direction="column" alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">Bullish</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="secondary">{(peers.sentiment.bullishPercent * 100).toFixed(2)}%</Typography>
                    </Grid>
                </Grid>
                <Grid container item xs={5} direction="column" alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">Bearish</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="secondary">{(peers.sentiment.bearishPercent * 100).toFixed(2)}%</Typography>
                    </Grid>
                </Grid>

            </Grid>
    )
}
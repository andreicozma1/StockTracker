
import { Button, CircularProgress, Grid, makeStyles, Typography } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
import { useEffect, useState } from "react";
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
    root: {
        height: 500,
    },
    retryButton: {
        width: "100%",
    }
}))

const columns = [
    {
        field: 'period',
        headerName: 'Period',
        type: 'date',
        width: 110
    },
    {
        field: 'strongBuy',
        headerName: 'BUY',
        type: 'number',
        width: 75
    },
    {
        field: 'buy',
        headerName: 'Buy',
        type: 'number',
        width: 75
    },
    {
        field: 'hold',
        headerName: 'Hold',
        type: 'number',
        width: 75,
    },
    {
        field: 'sell',
        headerName: 'Sell',
        type: 'number',
        width: 75,
    },
    {
        field: 'strongSell',
        headerName: 'SELL',
        type: 'number',
        width: 75,
    },
];

export default function RecomTrends(props) {
    const classes = useStyles()

    const [data, setData] = useState(null);



    const refresh = function () {

        console.info("refresh: Fetching fresh Recommendation Trends data for " + props.ticker);

        axios.get('https://finnhub.io/api/v1/stock/recommendation', {
            params: {
                symbol: props.ticker,
                token: process.env.REACT_APP_FINNHUB_KEY
            }
        }).then(result => {
            console.info("refresh: Got Recommendation Trends data for " + props.ticker);
            console.log(result)
            const recommendations_arr = result.data
            recommendations_arr.forEach(function (element) {
                element.id = element.period;
            });
            setData(result.data)
        })

    }
    useEffect(refresh, []);

    return (
        data == null ? <Grid container justify="space-around" alignItems="center">
            <Grid item xs={4}>
                <Typography variant="subtitle2">RECOMMENDATION TRENDS</Typography>
            </Grid>

            <Grid container item xs={8} spacing={1} className={classes.root} justify="flex-end" alignItems="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={refresh}
                    startIcon={
                        <CircularProgress size={20} color="inherit" />
                    }>
                    RELOAD
                </Button>
            </Grid>
        </Grid> : <div className={classes.root}>
                <DataGrid rows={data} columns={columns} autoPageSize showCellRightBorder disableColumnMenu scrollbarSize="20" rowHeight={30} />
            </div>
    )
}
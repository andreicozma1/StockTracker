
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
const useStyles = makeStyles((theme) => ({

    card: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    table: {
        height: 1000,
    },
}))

function formatCurrency(amount) {
    return (amount).toLocaleString("en-US", {
        style: 'currency',
        currency: "USD",
    });
}
function formatDate(date) {
    return ("00" + (date.getMonth() + 1)).slice(-2)
        + "/" + ("00" + date.getDate()).slice(-2)
        + "/" + date.getFullYear() + " "
        + ("00" + date.getHours()).slice(-2) + ":"
        + ("00" + date.getMinutes()).slice(-2)
        + ":" + ("00" + date.getSeconds()).slice(-2);
}

const columns = [
    {
        field: 'date',
        headerName: 'Date',
        type: 'date',
        width: 175,
        valueFormatter: (params) => formatDate(new Date(params.value))
    },
    {
        field: 'ticker',
        headerName: 'Ticker',
        width: 100
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 100
    },
    {
        field: 'units',
        headerName: 'Units',
        type: 'number',
        width: 100,
    },
    {
        field: 'price',
        headerName: 'Price',
        type: 'number',
        width: 125,
        valueFormatter: (params) => formatCurrency(params.value)
    },
    {
        field: 'fees',
        headerName: 'Fees',
        type: 'number',
        width: 100,
        valueFormatter: (params) => formatCurrency(params.value)

    },
    {
        field: 'split',
        headerName: 'Split',
        type: 'number',
        width: 100,
    },
];


export default function PastTransactions({ rows }) {
    const classes = useStyles();

    return (
        <Paper className={classes.card}>
            <Typography variant="h5" color="primary">Past Transactions</Typography>
            <div className={classes.table}>
                <DataGrid rows={rows} columns={columns} autoPageSize showCellRightBorder scrollbarSize="20" rowHeight={30} />

            </div>
        </Paper>
    )
}

import { makeStyles, Paper, Typography } from "@material-ui/core"
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

const columns = [
    {
        field: 'date',
        headerName: 'Date',
        type: 'date',
        width: 150
    },
    {
        field: 'ticker',
        headerName: 'Ticker',
        width: 120
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
        width: 100,
    },
    {
        field: 'fees',
        headerName: 'Fees',
        type: 'number',
        width: 100,
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
                <DataGrid rows={rows} columns={columns} autoPageSize showCellRightBorder disableColumnMenu scrollbarSize="20" rowHeight={30} />

            </div>
        </Paper>
    )
}
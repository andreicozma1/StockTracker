
import { DataTypeProvider, IntegratedPaging, IntegratedSorting, IntegratedSummary, PagingState, SelectionState, SortingState, SummaryState } from '@devexpress/dx-react-grid';
import {
    DragDropProvider,
    Grid,
    PagingPanel,
    Table,
    TableColumnReordering,
    TableColumnResizing,
    TableHeaderRow,
    TableSelection,
    TableSummaryRow
} from '@devexpress/dx-react-grid-material-ui';
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { useState } from "react";
const useStyles = makeStyles((theme) => ({

    card: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    table: {
    },
}))

function formatCurrency({ value }) {
    return (value).toLocaleString("en-US", {
        style: 'currency',
        currency: "USD",
    });
}

const CurrencyTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={formatCurrency}
        {...props}
    />
);


function formatDate({ value }) {
    var date = new Date(Date.parse(value))
    return ("00" + (date.getMonth() + 1)).slice(-2)
        + "/" + ("00" + date.getDate()).slice(-2)
        + "/" + date.getFullYear() + " "
        + ("00" + date.getHours()).slice(-2) + ":"
        + ("00" + date.getMinutes()).slice(-2)
        + ":" + ("00" + date.getSeconds()).slice(-2);
}

const DateTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={formatDate}
        {...props}
    />
);

const UnitTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={({ value }) => value.toFixed(2)}
        {...props}
    />
);

export default function PastTransactions({ rows, setTransactions }) {
    const classes = useStyles();

    const columns = [
        {
            name: 'date',
            title: 'Date',
            // renderCell: (params) => (
            //     <div onMouseEnter={(event) => onMouseOver(event, params)}>
            //         {formatDate(new Date(params.value))}
            //         <IconButton onClick={(event) => handleRemoveRow(event, params)}><Close /></IconButton>
            //     </div>
            // )
        },
        {
            name: 'symbol',
            title: 'Ticker',
        },
        {
            name: 'type',
            title: 'Action',
        },
        {
            name: 'units',
            title: 'Units',
        },
        {
            name: 'price',
            title: 'Price',
        },
        {
            name: 'fees',
            title: 'Fees',

        },
        {
            name: 'split',
            title: 'Split',
        },
    ];
    const totalSummaryItems = [
        { columnName: 'date', type: 'count' },
        { columnName: 'fees', type: 'sum' },
    ];

    const defaultColumnWidths = [
        { columnName: 'date', width: 160 },
        { columnName: 'symbol', width: 100 },
        { columnName: 'type', width: 100 },
        { columnName: 'units', width: 100 },
        { columnName: 'price', width: 150 },
        { columnName: 'fees', width: 100 },
        { columnName: 'split', width: 100 },
    ];

    const currencyColumns = ["price", "fees"];
    const dateColumns = ["date"];
    const twoDigitColumns = ["units"];
    const tableColumnExtensions = [
        { columnName: 'units', align: 'right' },
        { columnName: 'price', align: 'right' },
        { columnName: 'fees', align: 'right' },
        { columnName: 'split', align: 'center' },

    ];

    const [selection, setSelection] = useState([1]);

    return (
        <Paper className={classes.card}>
            <Typography variant="h5" color="primary">Past Transactions</Typography>
            <div className={classes.table}>
                <Grid
                    rows={rows}
                    columns={columns}
                >


                    <CurrencyTypeProvider for={currencyColumns} />
                    <DateTypeProvider for={dateColumns} />
                    <UnitTypeProvider for={twoDigitColumns} />

                    <SelectionState selection={selection} onSelectionChange={setSelection} />
                    <SummaryState
                        totalItems={totalSummaryItems}
                    />
                    <IntegratedSummary />

                    <PagingState defaultCurrentPage={0} pageSize={15} />
                    <IntegratedPaging />

                    <DragDropProvider />

                    <SortingState defaultSorting={[{ columnName: "date", direction: "desc" }]} />
                    <IntegratedSorting />

                    <Table columnExtensions={tableColumnExtensions} />
                    <TableSelection />
                    <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />

                    <TableHeaderRow showSortingControls />
                    <TableSummaryRow />
                    <PagingPanel />
                    <TableColumnReordering defaultOrder={['date', 'symbol', 'type', 'units', 'price', 'fees', 'split']} />

                </Grid>

                {/* <DataGrid rows={rows} columns={columns} autoPageSize showCellRightBorder scrollbarSize="20" rowHeight={30} checkboxSelection showToolbar="true" onSelectionChange={handleSelection} /> */}

            </div>
        </Paper>
    )
}
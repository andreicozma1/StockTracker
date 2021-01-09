
import {makeStyles, Paper, TableContainer, TableHead, Table, TableBody, TableRow, TableCell, Typography} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        justifyContents: "center",

        
    },
    inputDatePicker: {
        minWidth: 100,
        width: "100%"
    },
    inputSelector: {
        minWidth: 75,
        width: "100%"
    },
    inputSubmit: {
        width: 200,
    },

    card: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    
    transactionForm: {
        margin: theme.spacing(2, 0, 1),
        '& .MuiTextField-root': {
            minWidth: 100,
            width: "100%"
        },
    }
}))

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0),
  ];


export default function PastTransactions(){
    const classes = useStyles();

    return (
        <Paper className={classes.card}>
            <Typography variant="h5" color="primary">Past Transactions</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Transacted Units</TableCell>
                            <TableCell>Transacted Price (per unit)</TableCell>
                            <TableCell>Fees</TableCell>
                            <TableCell>Stock Split Ratio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Transacted Units</TableCell>
                            <TableCell>Transacted Price (per unit)</TableCell>
                            <TableCell>Fees</TableCell>
                            <TableCell>Stock Split Ratio</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

import { TextField, makeStyles, Grid, Paper, Button, MenuItem, Select, FormControl, InputLabel, Typography } from "@material-ui/core"
import { useState } from "react"
import { DateTimePicker } from "@material-ui/pickers";

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

/* ID Must not be changed and be unique */
const transTypes = {
    "Buy": 1000,
    "Sell": 1005,
    "Split": 1010,
    "Div": 1015,
    "Fee": 1020,
};

export default function NewTransaction(props) {
    const classes = useStyles();

    const [transDate, transDateSet] = useState(new Date());
    const [transType, transTypeSet] = useState(transTypes["Buy"]);
    const [transTicker, transTickerSet] = useState("");
    const [transUnits, transUnitsSet] = useState("");
    const [transPrice, transPriceSet] = useState("");
    const [transFees, transFeesSet] = useState("");
    const [transSplit, transSplitSet] = useState("");

    return (
        <Paper className={classes.card}>
            <Typography variant="h5" color="primary">New Transaction</Typography>
            <form className={classes.transactionForm}>
                <Grid container spacing={1} justify="center">

                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <DateTimePicker className={classes.inputDatePicker} label="Date" inputVariant="outlined" value={transDate} onChange={transDateSet} />
                    </Grid>
                    <Grid item xs={6} sm={3} md={3} lg={1}>
                        <FormControl required className={classes.inputSelector}>
                            <InputLabel id="label-ticker">Action</InputLabel>
                            <Select variant="outlined" value={transType} onChange={(e) => transTypeSet(e.target.value)} >
                                {
                                    Object.keys(transTypes).map((trans_name) => {
                                        const transId = transTypes[trans_name];
                                        return <MenuItem key={transId} value={transId}>{trans_name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={3} md={3} lg={1}>
                        <FormControl required className={classes.inputSelector}>
                            <InputLabel id="label-ticker">Ticker</InputLabel>
                            <Select labelId="label-ticker" variant="outlined" value={transTicker} onChange={(e) => transTickerSet(e.target.value)}>
                                <MenuItem>MRNA</MenuItem>
                                <MenuItem>AAPL</MenuItem>
                                <MenuItem>TSLA</MenuItem>
                                <MenuItem>AMZN</MenuItem>
                                <MenuItem>NIO</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>


                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <TextField required label="Transacted Units" type="number" variant="outlined" value={transUnits} onChange={(e) => transUnitsSet(e.target.value)}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <TextField required label="Transacted Price" type="number" variant="outlined" value={transPrice} onChange={(e) => transPriceSet(e.target.value)}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <TextField required label="Fees" type="number" variant="outlined" value={transFees} onChange={(e) => transFeesSet(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <TextField required label="Stock Split Ratio" type="number" variant="outlined" value={transSplit} onChange={(e) => transSplitSet(e.target.value)}/>
                    </Grid>

                    <Grid item>
                        <Button className={classes.inputSubmit} variant="contained" color="secondary" onClick={props.onClick}>Add Transaction</Button>
                    </Grid>

                </Grid>
            </form>
        </Paper>
    )
}
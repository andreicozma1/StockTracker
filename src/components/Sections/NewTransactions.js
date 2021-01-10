
import {TextField, makeStyles, Grid, Paper, Button, MenuItem, Select, FormControl, InputLabel, Typography} from "@material-ui/core"
import {useState} from "react"
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

const axios = require('axios');
const intriniokey = "OjVmNDQ5NjIwMmNiOTVjOTNkZjI1NTRkY2M1ODE0MGZl";

export default function NewTransaction(){
    const classes = useStyles();

    const [transDate, transDateSet] = useState(new Date());
    const [transType, transTypeSet] = useState(transTypes["Buy"]);
    const [transTicker, transTickerSet] = useState("");
    
    axios.get("https://api-v2.intrinio.com/securities/AAPL/prices?api_key=" + intriniokey)
    .then(response => {
        console.log(response);
        console.log(response.data.url);
        console.log(response.data.explanation);
    })
    .catch(error => {
        console.log(error);
    });

    return (
        <Paper className={classes.card}>
            <Typography variant="h5" color="primary">New Transaction</Typography>
            <form className={classes.transactionForm}>
                <Grid container spacing={1} justify="center">
                    
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <DateTimePicker className={classes.inputDatePicker} label="Date" inputVariant="outlined" value={transDate} onChange={transDateSet}/> 
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
                            <TextField required label="Transacted Units" variant="outlined"/>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <TextField required label="Transacted Price" variant="outlined"/>
                        </Grid>


        
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <TextField required label="Fees" variant="outlined"/>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <TextField required label="Stock Split Ratio" variant="outlined"/>
                        </Grid>
                
                        <Grid item>
                            <Button className={classes.inputSubmit} variant="contained" color="secondary">Add Transaction</Button>
                        </Grid>
                        
                </Grid>
            </form>
        </Paper>
    )
}

import { FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import PropTypes from "prop-types";
import { def_trans_types } from "../Defaults";
import SearchStocks from "./SearchStocks";

const useStyles = makeStyles((theme) => ({
    inputDatePicker: {
        minWidth: 100,
        width: "100%"
    },
    inputSelector: {
        minWidth: 75,
        width: "100%"
    },
    inputSubmit: {
        width: "100%",
        textAlign: "center",
        margin: theme.spacing(2, 0)
    },

    card: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(1)
    },

}))


export default function NewTransaction({ transaction, setTransaction }) {
    const classes = useStyles();


    const handleChange = (value, element) => {
        var new_state = { ...transaction };
        new_state[element] = value;
        setTransaction(new_state)
    }

    return (
        <form>
            <Grid container spacing={1} justify="center">

                <Grid item xs={6}>
                    <DateTimePicker className={classes.inputDatePicker} label="Date" inputVariant="outlined" value={transaction.date} onChange={(val) => handleChange(val, "date")} />
                </Grid>

                <Grid item xs={4}>
                    <SearchStocks className={classes.inputDatePicker} label="Stock Symbol" value={transaction.symbol} onChange={(event, value) => handleChange(value, "symbol")} />
                </Grid>

                <Grid item xs={2}>
                    <FormControl required className={classes.inputSelector}>
                        <InputLabel>Type</InputLabel>
                        <Select variant="outlined" value={transaction.type} onChange={(event) => handleChange(event.target.value, "type")} >
                            {
                                Object.keys(def_trans_types.ref).map((trans_id) => {
                                    const trans_name = def_trans_types.ref[trans_id];
                                    return <MenuItem key={trans_id} value={trans_id}>{trans_name}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <TextField required className={classes.inputDatePicker} label="Asset Amount" type="number" variant="outlined" value={transaction.units} onChange={(event) => handleChange(event.target.value, "units")} />
                </Grid>

                <Grid item xs={6}>
                    <TextField required className={classes.inputDatePicker} label="Asset Price" type="number" variant="outlined" value={transaction.price} onChange={(event) => handleChange(event.target.value, "price")} />
                </Grid>

                <Grid item xs={6}>
                    <TextField required className={classes.inputDatePicker} label="Fees" type="number" variant="outlined" value={transaction.fees} onChange={(event) => handleChange(event.target.value, "fees")} />
                </Grid>
                <Grid item xs={6}>
                    <TextField required className={classes.inputDatePicker} label="Stock Split Ratio" type="number" variant="outlined" value={transaction.split} onChange={(event) => handleChange(event.target.value, "split")} />
                </Grid>

            </Grid>

        </form>

    )
}

NewTransaction.propTypes = {
    transaction: PropTypes.object.isRequired,
    setTransaction: PropTypes.func.isRequired,
}
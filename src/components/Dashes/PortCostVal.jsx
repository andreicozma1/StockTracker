
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    paper: {
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1),
        },
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(2),
        },
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    positive: {
        color: theme.palette.text.positive
    },
    negative: {
        color: theme.palette.text.negative
    }
}));

function formatCurrency(amount, currency, locale) {
    return (amount).toLocaleString(locale, {
        style: 'currency',
        currency: currency,
    });
}

export default function PortfolioCostValue({ totalCost, totalValue }) {
    const classes = useStyles();

    const locale = 'en-US';
    const currency = "USD";

    const diff = totalValue - totalCost;

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Total Cost
                    </Typography>
                    <Typography variant="h3">
                        {totalCost ? formatCurrency(totalCost, currency, locale) : "Loading..."}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Total Value
                    </Typography>
                    <Typography variant="h3" className={(diff > 0) ? classes.positive : ((diff < 0) ? classes.negative : null)}>
                        {totalValue ? formatCurrency(totalValue, currency, locale) : "Loading..."}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}

PortfolioCostValue.propTypes = {
    totalCost: PropTypes.number.isRequired,
    totalValue: PropTypes.number.isRequired,
}
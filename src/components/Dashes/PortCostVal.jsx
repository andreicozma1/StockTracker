
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';

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

function PortfolioCostValue() {
    const classes = useStyles();

    const locale = 'en-US';
    const currency = "USD";

    const dollar_cost = 5000;
    const dollar_unrealized = 1000;
    const dollar_value = dollar_cost + dollar_unrealized;

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Total Cost
                    </Typography>
                    <Typography variant="h3">
                        {formatCurrency(dollar_cost, currency, locale)}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Total Value
                    </Typography>
                    <Typography variant="h3" className={dollar_value >= dollar_cost ? classes.positive : classes.negative}>
                        {formatCurrency(dollar_value, currency, locale)}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default PortfolioCostValue;

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
        color: theme.palette.text.secondary
    },
    positive: {
        color: theme.palette.text.positive
    },
    negative: {
        color: theme.palette.text.negative
    },
}));

function formatCurrency(amount, currency, locale) {
    return (amount).toLocaleString(locale, {
        style: 'currency',
        currency: currency,
    });
}

export default function UnrReaGL({ unrealized, realized }) {
    const classes = useStyles();

    const locale = 'en-US';
    const currency = "USD";

    const dollar_total = unrealized + realized;

    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Unr. Gain/Loss
                    </Typography>
                    <Typography variant="h4" className={unrealized >= 0 ? classes.positive : classes.negative}>
                        {unrealized ? formatCurrency(unrealized, currency, locale) : "Loading..."}
                    </Typography>

                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Rea. Gain/Loss
                    </Typography>
                    <Typography variant="h4" className={realized >= 0 ? classes.positive : classes.negative}>
                        {realized ? formatCurrency(realized, currency, locale) : "Loading..."}
                    </Typography>

                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Total Gain/Loss
                    </Typography>
                    <Typography variant="h4" className={dollar_total >= 0 ? classes.positive : classes.negative}>
                        {dollar_total ? formatCurrency(dollar_total, currency, locale) : "Loading..."}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
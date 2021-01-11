
import { Grid, Paper, makeStyles, Typography } from '@material-ui/core'

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

export default function UnrReaGL() {
    const classes = useStyles();

    const locale = 'en-US';
    const currency = "USD";

    const dollar_unrealized = 1000;
    const dollar_realized = -2500;
    const dollar_total = dollar_unrealized + dollar_realized;

    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Unr. Gain/Loss
                    </Typography>
                    <Typography variant="h4" className={dollar_unrealized >= 0 ? classes.positive : classes.negative}>
                        {formatCurrency(dollar_unrealized, currency, locale)}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Rea. Gain/Loss
                    </Typography>
                    <Typography variant="h4" className={dollar_realized >= 0 ? classes.positive : classes.negative}>
                        {formatCurrency(dollar_realized, currency, locale)}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Total Gain/Loss
                    </Typography>
                    <Typography variant="h4" className={dollar_total >= 0 ? classes.positive : classes.negative}>
                        {formatCurrency(dollar_total, currency, locale)}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
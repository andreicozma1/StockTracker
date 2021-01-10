
import { Grid, makeStyles, Button, CircularProgress, Typography, Divider, Paper } from "@material-ui/core"

export default function RecommTrendSection({jsonval}) {

    return (
        <Grid container item xs={12} justify="space-around" alignItems="center">

            <Grid item xs={2}>
                <Typography variant="subtitle2">{jsonval.period}</Typography>
            </Grid>

            <Grid container item xs={2} direction="column" alignItems="center">
                <Grid item>
                    <Typography variant="subtitle1">BUY</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" color="secondary">{jsonval.strongBuy}</Typography>
                </Grid>
            </Grid>

            <Grid container item xs={2} direction="column" alignItems="center">
                <Grid item>
                    <Typography variant="subtitle1">Buy</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" color="secondary">{jsonval.buy}</Typography>
                </Grid>
            </Grid>


            <Grid container item xs={2} direction="column" alignItems="center">
                <Grid item>
                    <Typography variant="subtitle1">Hold</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" color="secondary">{jsonval.hold}</Typography>
                </Grid>
            </Grid>


            <Grid container item xs={2} direction="column" alignItems="center">
                <Grid item>
                    <Typography variant="subtitle1">Sell</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" color="secondary">{jsonval.sell}</Typography>
                </Grid>
            </Grid>

            <Grid container item xs={2} direction="column" alignItems="center">
                <Grid item>
                    <Typography variant="subtitle1">SELL</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" color="secondary">{jsonval.strongSell}</Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider/>
            </Grid>
        </Grid>
    )
}
   

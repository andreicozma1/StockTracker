import { Grid } from "@material-ui/core";

function Stock({ info }) {
    console.log("Rendering page Stock");

    return (
        <Grid container spacing={1}>
            <Grid item>
                {info.symbol}
            </Grid>
            <Grid item>
                {info.current_shares}
            </Grid>
            <Grid item>
                {info.current_investment}
            </Grid>
        </Grid>
    );
}

export default Stock;
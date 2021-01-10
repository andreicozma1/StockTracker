import { useState } from "react"
import clsx from 'clsx';
import { BusinessTwoTone, Delete, ExpandMore, InfoTwoTone, Phone, Public } from "@material-ui/icons"
import { Paper, Typography, Card, CardContent, Grid, makeStyles, Avatar, CardHeader, IconButton, CardActions, Collapse, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import Peers from "./Peers";
import NewsSentiment from "./NewsSentiment";
import RecommendationTrend from "./RecomTrends";

const useStyles = makeStyles((theme) => ({
    headerRoot: {
        backgroundColor: theme.palette.secondary.main,
    },
    headerAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    headerText: {
        color: "white",
    },
    currentPriceStyle: {
        fontWeight: "bold"
    },
    collapseStyle: {
        backgroundColor: theme.palette.snow
    },
    alignRight: {
        textAlign: "right"
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },

}))

function formatCurrency(amount, currency) {
    return (amount).toLocaleString("en-US", {
        style: 'currency',
        currency: currency,
    });
}

export default function StockCard(props) {

    const classes = useStyles();
    const card = props.info;

    const [expanded, setExpanded] = useState(false);

    return (
        <Card>
            <CardHeader
                classes={
                    {
                        root: classes.headerRoot,
                        title: classes.headerText,
                        subheader: classes.headerText
                    }
                }
                avatar={
                    <Avatar component={Paper} className={classes.headerAvatar} variant="rounded" src={card.logo}>{card.ticker[0]}</Avatar>
                }
                title={card.name + " (" + card.ticker + ")"}
                titleTypographyProps={{ variant: "h6" }}
                subheader={card.finnhubIndustry}
                subheaderTypographyProps={{ variant: "subtitle1" }}
                action={
                    <IconButton className={classes.headerText} onClick={props.onClose}>
                        <Delete />
                    </IconButton>
                }
            />
            <Divider />
            <CardContent>
                <Grid container spacing={3} justify="space-between" alignItems="center">

                    <Grid item xs={6}>
                        <Typography variant="h4" className={classes.currentPriceStyle}>{card.quote.c ? formatCurrency(card.quote.c, card.currency) : "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography className={classes.alignRight} variant="subtitle2">{card.exchange} <br /> {card.country + " - " + card.currency}</Typography>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">Prev Close {card.quote.hasOwnProperty("backup") ? card.country : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" color="secondary">{card.quote.pc ? formatCurrency(card.quote.pc, card.currency) : "N/A"}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">Day Open {card.quote.hasOwnProperty("backup") ? card.country : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" color="secondary">{card.quote.o ? formatCurrency(card.quote.o, card.currency) : "N/A"}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">High today {card.quote.hasOwnProperty("backup") ? card.country : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" color="secondary">{card.quote.h ? formatCurrency(card.quote.h, card.currency) : "N/A"}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">Low Today {card.quote.hasOwnProperty("backup") ? card.country : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" color="secondary">{card.quote.l ? formatCurrency(card.quote.l, card.currency) : "N/A"}</Typography>
                        </Grid>
                    </Grid>

                </Grid>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton color="secondary" href={card.weburl} target="_blank">
                    <Public />
                </IconButton>
                <IconButton color="secondary" href={card.phone} target="_blank">
                    <Phone />
                </IconButton>
                <IconButton
                    color="secondary"
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                >
                    <ExpandMore />
                </IconButton>
            </CardActions>
            <Divider />
            <Collapse in={expanded} timeout="auto" unmountOnExit classes={{ container: classes.collapseStyle }}>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <InfoTwoTone color="secondary" />
                        </ListItemAvatar>
                        <ListItemText>
                            <Grid container item justify="space-around" alignItems="center">
                                <Grid container item xs={3} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">IPO</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" color="secondary">{card.ipo}</Typography>
                                    </Grid>
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                                <Grid container item xs={3} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">Shares Outst</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" color="secondary">{card.shareOutstanding}M</Typography>
                                    </Grid>
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                                <Grid container item xs={3} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">Market Cap</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" color="secondary">{formatCurrency(card.marketCapitalization, card.currency)}M</Typography>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </ListItemText>
                    </ListItem>

                    <Divider component="li" />

                    <ListItem>
                        <ListItemAvatar>
                            <BusinessTwoTone color="secondary" />
                        </ListItemAvatar>
                        <ListItemText>
                            <Peers ticker={card.ticker} />
                        </ListItemText>
                    </ListItem>

                    <Divider component="li" />

                    <ListItem>
                        <ListItemAvatar>
                            <BusinessTwoTone color="secondary" />
                        </ListItemAvatar>
                        <ListItemText>
                            <NewsSentiment ticker={card.ticker} />
                        </ListItemText>
                    </ListItem>

                    <Divider component="li" />

                    <ListItem>
                        <ListItemAvatar>
                            <BusinessTwoTone color="secondary" />
                        </ListItemAvatar>
                        <ListItemText>
                            <RecommendationTrend ticker={card.ticker} />
                        </ListItemText>
                    </ListItem>
                </List>

            </Collapse>
        </Card>
    )
}
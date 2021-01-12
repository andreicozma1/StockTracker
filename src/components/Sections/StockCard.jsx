import { Avatar, Card, CardActions, CardContent, CardHeader, Collapse, Divider, Fade, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Paper, Tooltip, Typography, withStyles } from "@material-ui/core";
import { BusinessTwoTone, Delete, ExpandMore, InfoTwoTone, Phone, Public } from "@material-ui/icons";
import clsx from 'clsx';
import { useState } from "react";
import NewsSentiment from "./NewsSentiment";
import Peers from "./Peers";
import RecommendationTrend from "./RecomTrends";

const useStyles = makeStyles((theme) => ({
    headerRoot: {
        backgroundColor: theme.palette.secondary.main,
    },
    headerAvatarBtn: {
        padding: 0,
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
        backgroundColor: theme.palette.secondary.snow
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
    positive: {
        color: theme.palette.text.positive,
        fontWeight: "bold"
    },
    negative: {
        color: theme.palette.text.negative,
        fontWeight: "bold"
    }
}))

const BigTooltip = withStyles((theme) => ({
    tooltip: {
        fontSize: 16,
        fontWeight: "bold"
    },
}))(Tooltip);

function formatCurrency(amount) {
    return (amount).toLocaleString("en-US", {
        style: 'currency',
        currency: "USD",
    });
}

function getChangeText(current, compare, showStart) {
    const difference = current - compare
    return (showStart ? "Current price is " : "") + (difference >= 0 ? "+" : "") + difference.toFixed(2) + " (" + (difference >= 0 ? "+" : "") + ((current / compare - 1) * 100).toFixed(2) + "%)";
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
                    <Tooltip title="Open in new window" arrow placement="top-start">
                        <IconButton className={classes.headerAvatarBtn}>
                            <Avatar component={Paper} className={classes.headerAvatar} variant="rounded" src={card.logo}>{card.ticker[0]}</Avatar>
                        </IconButton>
                    </Tooltip>

                }
                title={card.name + " (" + card.ticker + ")"}
                titleTypographyProps={{ variant: "h6" }}
                subheader={card.finnhubIndustry}
                subheaderTypographyProps={{ variant: "subtitle1" }}
                action={
                    <Tooltip title="Remove card" arrow placement="left">
                        <IconButton className={classes.headerText} onClick={props.onClose}>
                            <Delete />
                        </IconButton>
                    </Tooltip>

                }
            />
            <Divider />
            <CardContent>
                <Grid container spacing={3} justify="space-between" alignItems="center">

                    <Grid container item xs={9} direction="column">
                        <Grid item>
                            <Typography variant="h4" className={classes.currentPriceStyle}>{card.quote.c ? formatCurrency(card.quote.c) : "N/A"}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5" className={(card.quote.c - card.quote.pc >= 0) ? classes.positive : classes.negative}>{getChangeText(card.quote.c, card.quote.pc, false)}</Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography className={classes.alignRight} variant="subtitle2">{card.exchange} <br /> {card.country + " - " + card.currency}</Typography>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">Prev Close {card.quote.hasOwnProperty("backup") ? card.country : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <BigTooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} leaveDelay={200} title={getChangeText(card.quote.c, card.quote.pc, true)} arrow>
                                <Typography variant="h6" color="secondary">{card.quote.pc ? formatCurrency(card.quote.pc) : "N/A"}</Typography>
                            </BigTooltip>
                        </Grid>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">Day Open {card.quote.hasOwnProperty("backup") ? card.country : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <BigTooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} leaveDelay={200} title={getChangeText(card.quote.c, card.quote.o, true)} arrow>
                                <Typography variant="h6" color="secondary">{card.quote.o ? formatCurrency(card.quote.o) : "N/A"}</Typography>
                            </BigTooltip>

                        </Grid>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">High today {card.quote.hasOwnProperty("backup") ? card.country : ""}</Typography>
                        </Grid>
                        <Grid item>

                            <BigTooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} leaveDelay={200} title={getChangeText(card.quote.c, card.quote.h, true)} arrow>

                                <Typography variant="h6" color="secondary">{card.quote.h ? formatCurrency(card.quote.h) : "N/A"}</Typography>
                            </BigTooltip>

                        </Grid>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">Low Today {card.quote.hasOwnProperty("backup") ? card.country : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <BigTooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} leaveDelay={200} title={getChangeText(card.quote.c, card.quote.l, true)} arrow>

                                <Typography variant="h6" color="secondary">{card.quote.l ? formatCurrency(card.quote.l) : "N/A"}</Typography>
                            </BigTooltip>

                        </Grid>
                    </Grid>

                </Grid>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title={"Open " + card.weburl} arrow>
                    <IconButton color="secondary" href={card.weburl} target="_blank">
                        <Public />
                    </IconButton>
                </Tooltip>

                <Tooltip title={"Call " + card.phone} arrow>
                    <IconButton color="secondary" href={"tel:" + card.phone} target="_blank">
                        <Phone />
                    </IconButton>
                </Tooltip>

                <Tooltip title={(expanded ? "Hide" : "Show") + " details"} arrow placement="left">
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
                </Tooltip>
            </CardActions>
            <Divider />
            <Collapse in={expanded} timeout="auto" classes={{ container: classes.collapseStyle }}>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Tooltip title="Click to refresh" arrow>
                                <InfoTwoTone color="secondary" />
                            </Tooltip>
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
                            <Tooltip title="Click to refresh" arrow>
                                <BusinessTwoTone color="secondary" />
                            </Tooltip>
                        </ListItemAvatar>
                        <ListItemText>
                            <Peers ticker={card.ticker} />
                        </ListItemText>
                    </ListItem>

                    <Divider component="li" />

                    <ListItem>
                        <ListItemAvatar>
                            <Tooltip title="Click to refresh" arrow>
                                <BusinessTwoTone color="secondary" />
                            </Tooltip>
                        </ListItemAvatar>
                        <ListItemText>
                            <NewsSentiment ticker={card.ticker} />
                        </ListItemText>
                    </ListItem>

                    <Divider component="li" />

                    <ListItem>
                        <ListItemAvatar>
                            <Tooltip title="Click to refresh" arrow>
                                <BusinessTwoTone color="secondary" />
                            </Tooltip>
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
import { useState } from "react"
import { Autocomplete } from "@material-ui/lab"
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { Business, BusinessTwoTone, Delete, ExpandMore, InfoTwoTone, Phone, Public } from "@material-ui/icons"
import { Paper, TextField, Typography, Card, CardContent, Grid, makeStyles, Avatar, Snackbar, LinearProgress, CardHeader, IconButton, CardActions, Collapse, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import Peers from "../Sections/Peers";
import NewsSentiment from "../Sections/NewsSentiment";
import RecommendationTrend from "../Sections/RecommendationTrends";

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.up('md')]: {
            maxWidth: "50%"
        },
    },
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

    margin: {
        margin: theme.spacing(1, 0),
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

export default function StockCard(props) {

    const classes = useStyles();
    const card = props.info;

    const [expanded, setExpanded] = useState(false);

    return (
        <Card className={[classes.root, classes.margin].join(" ")}>
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
                        <Typography variant="h4" className={classes.currentPriceStyle}>{card.quote.c ? "$" + card.quote.c : "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography className={classes.alignRight} variant="subtitle2">{card.exchange} <br /> {card.country + " - " + card.currency}</Typography>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">Prev Close {card.quote.hasOwnProperty("backup") ? "(US)" : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" color="secondary">{card.quote.pc ? "$" + card.quote.pc : "N/A"}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">Day Open {card.quote.hasOwnProperty("backup") ? "(US)" : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" color="secondary">{card.quote.o ? "$" + card.quote.o : "N/A"}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">High today {card.quote.hasOwnProperty("backup") ? "(US)" : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" color="secondary">{card.quote.h ? "$" + card.quote.h : "N/A"}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item xs={3} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="subtitle1">Low Today {card.quote.hasOwnProperty("backup") ? "(US)" : ""}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" color="secondary">{card.quote.l ? "$" + card.quote.l : "N/A"}</Typography>
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
                                        <Typography variant="h6" color="secondary">{card.shareOutstanding}</Typography>
                                    </Grid>
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                                <Grid container item xs={3} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">Market Cap</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" color="secondary">${card.marketCapitalization}</Typography>
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
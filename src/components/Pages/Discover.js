import {useState} from "react"
import {Autocomplete} from "@material-ui/lab"
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import {Delete, ExpandMore, Phone, Public} from "@material-ui/icons"
import { TextField, Typography, Card, CardContent, Grid, makeStyles, Avatar, Snackbar, LinearProgress, CardHeader, IconButton, CardActions, Collapse } from "@material-ui/core";
import Peers from "../Sections/Peers";
const axios = require("axios");
const finnhubkey = "bvt0qjf48v6rku8bl5u0";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.up('md')]:{
            maxWidth: "50%"
        },
        "& .MuiButton-root": {
            width: "50%"
        },
        "& .MuiButtonGroup-root": {
            width: "100%"
        },
    },

    margin: {
        margin: theme.spacing(1, 0),
    },
    subtitle: {
        fontSize: "1rem"
    },
    large: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        margin: "auto"
    },
    alignRight: {
        textAlign:"right"
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

function compare(a, b) {
    if(a.description < b.description)
        return -1;
    if(a.description > b.description)
        return 1;
    return 0;
}

function logError(error) {
    if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
}

export default function Discover(){
    console.log("Discover");

    const classes = useStyles()

    const [stockList, stockListSet] = useState([])
    const [cards, setCards] = useState({});
    const [showSnackBar, setShowSnackbar] = useState("");
    const [showProgress, setShowProgress] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setShowSnackbar("");
    };

    const handleChange = async function(e) {
        const text = e.target.value;

        console.log("Searching for " + text);
        stockListSet([]);
        axios.get('https://finnhub.io/api/v1/search', {
            params: {
                q: encodeURIComponent(text),
                token: finnhubkey
            }
        }).then(resp => {
            const result_arr = resp.data.result
            result_arr.sort(compare)
            console.log("Got result of length " + result_arr.length)
            stockListSet(result_arr);
        }).catch(error => {
            logError(error);
            setShowSnackbar("Warning! Some search results failed to fetch.")
        })
    }

    const onSelect = async function(selected_arr) {
        console.log("Selected")
        console.log(selected_arr);
        
        var new_cards = {};
        if(selected_arr.length < Object.keys(cards).length){
            console.log(cards);
            for(var index in selected_arr){
                const stock = selected_arr[index];
                if(cards.hasOwnProperty(stock.symbol))
                    new_cards[stock.symbol] = cards[stock.symbol];
            }
            setCards(new_cards);
            return;
        }

        for(var index in selected_arr) {
            
            const stock = selected_arr[index]
            console.log(stock);
            if(cards.hasOwnProperty(stock.symbol)){
                new_cards[stock.symbol] = cards[stock.symbol];
                continue;
            }
            setShowProgress(true);
            axios.get('https://finnhub.io/api/v1/stock/profile2', {
                params: {
                    symbol: encodeURIComponent(stock.symbol),
                    token: finnhubkey
                }
            }).then(result => {
                var profile = result.data;

                // Attempt to get US Stock Quotes
                axios.get('https://finnhub.io/api/v1/quote', {
                    params: {
                        symbol: encodeURIComponent(stock.symbol),
                        token: finnhubkey
                    }
                }).then(result => {
                    // On success
                    var quote = result.data;
                    profile["quote"] = quote;
                    new_cards[profile.ticker] = profile;
                    setCards(new_cards);
                    setShowProgress(false);

                }).catch(error => {
                    // On fail
                    logError(error);

                    console.warn("Quotes not available in Global Market. Attempting to get U.S. Stock quotes.")
                    // Backup use ticker to get US Quotes instad
                    axios.get('https://finnhub.io/api/v1/quote', {
                        params: {
                            symbol: encodeURIComponent(profile.ticker),
                            token: finnhubkey
                        }
                    }).then(result => {
                        setShowSnackbar("Info! Showing U.S. Market Quotes.");
    
                        var quote = result.data;
                        quote["backup"] = true;
                        profile["quote"] = quote;
                        new_cards[profile.ticker] = profile;
                        setCards(new_cards);
                        setShowProgress(false);

                    }).catch(error => {
                        logError(error);
                        setShowSnackbar("Warning! Global Market Quotes are not available.");
                        console.error("Failed to get backup stock quotes");
                        var quote = {
                            pc: null,
                            o: null,
                            h: null,
                            l: null,
                            c: null,
                        }
                        profile["quote"] = quote;
                        new_cards[profile.ticker] = profile;
                        setCards(new_cards);
                        setShowProgress(false);
                    })
                })
     
            }).catch(error => {
                // On FAIL get stock
                logError(error);
                setShowSnackbar("Error! Failed to get stock data.");
                setShowProgress(false);

            })
        }
    }


    return (
        <div>
            {
            showProgress && <LinearProgress color="secondary"/>
            }
            
            <Autocomplete className={classes.margin}
            multiple
            filterSelectedOptions
            clearOnEscape
            options={stockList}
            groupBy={(option) => option.description}
            getOptionLabel={(option) => option.displaySymbol + "  -  " + option.description}
            loading={stockList.length === 0}
            onChange={(event, selected_arr) => onSelect(selected_arr)}
            renderInput={(params) => <TextField {...params} onChange={handleChange} label="Stock Search" variant="outlined"/>}
            >
            </Autocomplete>
           


            {
                Object.values(cards).map((card) => {
                    console.log(card)
                    return <Card key={card.country + "-" + card.currency + "-" + card.name + "-" + card.ticker} className={[classes.root, classes.margin].join(" ")} variant="outlined">
                        <CardHeader
                            avatar={
                            <Avatar className={classes.large} src={card.logo}>{card.ticker[0]}</Avatar>
                            }
                            title={card.name + " (" + card.ticker + ")"}
                            titleTypographyProps={{variant:"h6"}}
                            subheader={card.finnhubIndustry}
                            subheaderTypographyProps={{variant:"subtitle1"}}
                            action={
                                <IconButton>
                                    <Delete/>
                                </IconButton>
                            }
                        />
                        <CardContent>
                        <Grid container spacing={2} justify="center" alignItems="center">
                            <Grid container item xs={12} justify="space-between" align-items="center">
                                <Grid item xs={5}>
                                    <Typography variant="h4">{card.quote.c ? "$" + card.quote.c : "N/A"}</Typography>
                                </Grid>

                                <Grid item>
                                    <Typography className={classes.alignRight} variant="subtitle2">{card.exchange} <br/> {card.country + " - " + card.currency}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container item spacing={3} align-items="center">

                            <Grid container item xs={3} direction="column" alignItems="center">
                                <Grid item>
                                        <Typography variant="subtitle1">Previous Close {card.quote.hasOwnProperty("backup") ? "(US)" : ""}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" color="secondary">{card.quote.pc ? "$" + card.quote.pc : "N/A"}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container item xs={3} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">Day Open {card.quote.hasOwnProperty("backup") ? "(US)" : ""}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" color="secondary">{card.quote.o ? "$" + card.quote.o : "N/A"}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container item xs={3} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">High today {card.quote.hasOwnProperty("backup") ? "(US)" : ""}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" color="secondary">{card.quote.h ? "$" + card.quote.h : "N/A"}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container item xs={3} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">Low Today {card.quote.hasOwnProperty("backup") ? "(US)" : ""}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" color="secondary">{card.quote.l ? "$" + card.quote.l : "N/A"}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container item xs={4} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">Initial Public Offering</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" color="secondary">{card.ipo}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container item xs={4} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">Shares Outstanding</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" color="secondary">{card.shareOutstanding}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container item xs={4} direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1">Market Capitalization</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" color="secondary">${card.marketCapitalization}</Typography>
                                    </Grid>
                                </Grid>

                             
                            </Grid>
                            <Grid item xs={12}>
                                <Peers ticker={card.ticker}/>
                            </Grid>
                        </Grid>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton href={card.weburl} target="_blank">
                                <Public/>
                            </IconButton>
                            <IconButton href={card.phone} target="_blank">
                                <Phone/>
                            </IconButton>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: expanded,
                                })}
                                onClick={() => setExpanded(!expanded)}
                                aria-expanded={expanded}
                                aria-label="show more">
                                <ExpandMore />
                            </IconButton>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>Method:</Typography>
                            <Typography paragraph>
                                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                                minutes.
                            </Typography>
                            <Typography paragraph>
                                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                            </Typography>
                            <Typography paragraph>
                                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                                minutes more. (Discard any mussels that don’t open.)
                            </Typography>
                            <Typography>
                                Set aside off of the heat to let rest for 10 minutes, and then serve.
                            </Typography>
                        </CardContent>
                        </Collapse>
                    </Card>
                })
            }
            <Snackbar open={showSnackBar !== ""} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={showSnackBar.split("!")[0].toLowerCase()}>
                {showSnackBar}
                </Alert>
            </Snackbar>
        </div>
    )
}

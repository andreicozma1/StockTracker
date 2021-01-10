
import { Typography, Grid, makeStyles, Button, Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import { ExpandMore }  from "@material-ui/icons"
import {useState} from "react"

const axios = require("axios");
const finnhubkey = "bvt0qjf48v6rku8bl5u0";


const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiButton-root": {
            width: "100%"
        },
    },
}))


export default function Peers(props) {
    const classes = useStyles()

    const [peers, setPeers] = useState([]);
    
    const getPeers = async function(){

        console.log("Updating peers for " + props.ticker);
        if(peers.length === 0){
            axios.get('https://finnhub.io/api/v1/stock/peers', {
                params: {
                    symbol: props.ticker,
                    token: finnhubkey
                }
            }).then(result => {
                setPeers(result.data)        
            })
        } else {
            console.warn("Shall not update peers for " + props.ticker)
        }
    }

    const makePeerItem = (ticker) => {
        if(ticker === props.ticker)
            return null
       
        return  <Grid item xs={2} md={1} key={ticker}>
                    <Button variant="contained" color="secondary">{ticker}</Button>
                </Grid>
    }

    return <Accordion onChange={getPeers}  >
            <AccordionSummary expandIcon={<ExpandMore/>}>
                <Typography variant="h6">Peers</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.root}>
                <Grid container spacing={1} alignItems="center" justify="center" >
                {
                    (peers.length === 0) ? <h2>Loading ...</h2> : peers.map((ticker) => {
                        return makePeerItem(ticker) 
                    })
                }
                </Grid> 
            </AccordionDetails>
    </Accordion>
}
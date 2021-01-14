import { useEffect, useState } from 'react';
import PortCostVal from '../Dashes/PortCostVal';
import UnrReaGL from '../Dashes/UnrReaGL';
import Stock from './Stock';


const axios = require("axios");

function Dashboard({ transactions, setTransactions, summary, setSummary }) {
    console.log("Rendering page Dashboard");


    const [statistics, setStatistics] = useState({
        total_cost: 0,
        unrealized: 0,
        realized: 0,
    });


    useEffect(() => {
        async function fetchDetails() {
            console.log("Transactions changed. Refetching summary")

            var new_summary = { ...summary };

            for (var stock in new_summary) {

                const symbol = new_summary[stock].symbol;
                await axios.get('https://finnhub.io/api/v1/quote', {
                    params: {
                        symbol: symbol,
                        token: process.env.REACT_APP_FINNHUB_KEY
                    }
                }).then(result => {
                    console.info("Got quote for " + symbol);
                    // console.log(result)

                    new_summary[symbol].quote = result.data;

                    new_summary[symbol].unrealized_gain_loss = (new_summary[symbol].quote.c - new_summary[symbol].current_cost_per_share) * new_summary[symbol].current_shares;
                    new_summary[symbol].unrealized_gain_loss_perc = new_summary[symbol].unrealized_gain_loss / new_summary[symbol].current_investment
                    new_summary[symbol].current_market_value = new_summary[symbol].current_investment + new_summary[symbol].unrealized_gain_loss;
                    console.log(new_summary)


                    const new_total_cost = Object.values(new_summary).reduce((total, obj) => (obj.current_investment ? obj.current_investment : 0) + total, 0);
                    const unrl_gain_loss = Object.values(new_summary).reduce((total, obj) => (obj.unrealized_gain_loss ? obj.unrealized_gain_loss : 0) + total, 0);
                    const realized = Object.values(new_summary).reduce((total, obj) => (obj.gains_loss_from_sale ? obj.gains_loss_from_sale : 0) + total, 0);

                    console.log(new_total_cost);
                    console.log(unrl_gain_loss);
                    console.log(realized);

                    setStatistics({
                        total_cost: new_total_cost,
                        unrealized: unrl_gain_loss,
                        realized: realized,
                    })


                }).catch((error) => {
                    console.info("Failed to get quote for " + symbol);
                    console.log(error);
                });
            }
        }

        fetchDetails();
    }, [summary])

    return (
        <div>
            <PortCostVal totalCost={statistics.total_cost} totalValue={statistics.total_cost + statistics.unrealized} />
            <UnrReaGL unrealized={statistics.unrealized} realized={statistics.realized} />

            {
                Object.values(summary).map((key) => {
                    return <Stock key={key.symbol} info={key} />
                })
            }


        </div>
    );
}

export default Dashboard;
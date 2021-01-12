import { useEffect } from 'react';
import PortCostVal from '../Dashes/PortCostVal';
import UnrReaGL from '../Dashes/UnrReaGL';

function Dashboard({ transactions, setTransactions }) {
    console.log("Rendering page Dashboard");


    useEffect(() => {
        console.log(transactions)

        console.log("values");
        const values = Object.values(transactions);
        console.log(values)


        // Array of all unique stock names
        // Ex: ["BTC", "MRNA", "DRI", "YELP", "DIS", "AMZN", "CNK", "SNE", "PLAY", "BA", "AAL", "BYND", "NKLA", "SAVE", "NIO", "UAL", "DAL", "TSLA", "NVDA", "AAPL", "CAKE", "RCL", "HTZ", "CRON", "NCLH", "KSS", "TDOC"]
        const unique = values.map(item => item.symbol).filter((value, index, self) => self.indexOf(value) === index);
        console.log(unique);

        var summary = {}

        for (var index in unique) {
            const symbol = unique[index];

            // Array of transactions for each stock.
            const all_transactions = values.filter((value, index, self) => {
                return value.symbol === symbol;
            })

            const all_buy_transactions = all_transactions.filter((value, index, self) => {
                const type = value.type.toLowerCase()
                return type.includes("buy");
            });
            const sum_buy_units = all_buy_transactions.reduce((pv, cv) => pv + cv.units, 0)
            const sum_buy_dollar = all_buy_transactions.reduce((pv, cv) => pv + (cv.units * cv.price), 0)

            const all_sell_transactions = all_transactions.filter((value, index, self) => {
                const type = value.type.toLowerCase()
                return type.includes("sell");
            });
            const sum_sell_units = all_sell_transactions.reduce((pv, cv) => pv + cv.units, 0)
            const sum_sell_dollar = all_sell_transactions.reduce((pv, cv) => pv + (cv.units * cv.price), 0)


            const sum_units = sum_buy_units - sum_sell_units
            const sum_dollar = sum_buy_dollar - sum_sell_dollar


            summary[symbol] = {
                symbol: symbol,
                transactions: {
                    all: all_transactions,
                    units: sum_units,
                    dollar: sum_dollar,
                    buy: {
                        all: all_buy_transactions,
                        sum_units: sum_buy_units,
                        sum_dollar: sum_buy_dollar,
                    },
                    sell: {
                        all: all_sell_transactions,
                        sum_units: sum_sell_units,
                        sum_dollar: sum_sell_dollar,
                    }
                }
            }
            console.log(summary[symbol])
        }
    }, [transactions])

    return (
        <div>
            <PortCostVal />
            <UnrReaGL />
        </div>
    );
}

export default Dashboard;
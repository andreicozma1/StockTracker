
import { useEffect, useState } from "react";
const axios = require("axios");

export function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}


export function makeMenuItem(name, icon, callback) {
  return { name: name, icon: icon, callback: callback };
}

export async function fetchSummary(transactions) {
  // console.log(transactions)

  // console.log("values");
  const values = Object.values(transactions);
  // console.log(values)

  // Array of all unique stock names
  // Ex: ["BTC", "MRNA", "DRI", "YELP", "DIS", "AMZN", "CNK", "SNE", "PLAY", "BA", "AAL", "BYND", "NKLA", "SAVE", "NIO", "UAL", "DAL", "TSLA", "NVDA", "AAPL", "CAKE", "RCL", "HTZ", "CRON", "NCLH", "KSS", "TDOC"]
  const unique = values.map(item => item.symbol).filter((value, index, self) => self.indexOf(value) === index);
  // console.log(unique);

  var summary = {}

  for (var index in unique) {
    const symbol = unique[index];

    // Array of transactions for each stock.
    var all_transactions = values.filter((value, index, self) => {
      return value.symbol === symbol;
    })
    all_transactions = all_transactions.sort((a, b) => {
      return Date.parse(a.date) - Date.parse(b.date);
    });
    for (var i = 0; i < all_transactions.length; i++) {
      const type = all_transactions[i].type.toLowerCase();

      all_transactions[i].trans_value = all_transactions[i].price * all_transactions[i].units;
      all_transactions[i].cumulative_cost = all_transactions[i].prev_cost ? all_transactions[i].prev_cost : 0;
      all_transactions[i].prev_cost = (i > 0 ? all_transactions[i - 1].cumulative_cost : 0);

      // console.log(all_transactions[i].cumulative_cost)

      all_transactions[i].prev_units = (i > 0 ? all_transactions[i - 1].cumulative_units : 0);
      all_transactions[i].cumulative_units = all_transactions[i].prev_units;
      all_transactions[i].gains_loss_from_sale = 0;
      if (type.includes("buy")) {
        all_transactions[i].trans_value += all_transactions[i].fees;
        all_transactions[i].cumulative_cost += all_transactions[i].trans_value;

        all_transactions[i].cumulative_units += all_transactions[i].units;
      } else if (type.includes("sell")) {
        all_transactions[i].trans_value -= all_transactions[i].fees
        all_transactions[i].gains_loss_from_sale = all_transactions[i].trans_value - all_transactions[i].cost_of_trans;
        all_transactions[i].gains_loss_from_sale_perc = (all_transactions[i].trans_value - all_transactions[i].cost_of_trans) / all_transactions[i].cost_of_trans;


        all_transactions[i].cost_of_trans = (all_transactions[i].prev_units === 0 ? 0 : (all_transactions[i].units / all_transactions[i].prev_units * all_transactions[i].prev_cost))
        all_transactions[i].avg_stock_price = (all_transactions[i].prev_units === 0 ? 0 : (all_transactions[i].prev_cost / all_transactions[i].prev_units))


        all_transactions[i].cumulative_cost -= all_transactions[i].cost_of_trans;

        all_transactions[i].cumulative_units -= all_transactions[i].units;
      } else if (type.includes("div") || type.includes("fee")) {
        all_transactions[i].trans_value -= all_transactions[i].fees
        all_transactions[i].gains_loss_from_sale = all_transactions[i].trans_value
      } else if (type.includes("split")) {
        all_transactions[i].cumulative_units *= all_transactions[i].split;
      }
    }

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

    summary[symbol] = {
      symbol: symbol,
      transactions: {
        all: all_transactions,
        buy: {
          all: all_buy_transactions,
          sum_units: sum_buy_units,
          invested_all_time: sum_buy_dollar,
        },
        sell: {
          all: all_sell_transactions,
          sum_units: sum_sell_units,
          sold_all_time: sum_sell_dollar,
        }
      },
    }

    summary[symbol].current_shares = all_transactions[all_transactions.length - 1].cumulative_units
    summary[symbol].current_investment = all_transactions[all_transactions.length - 1].cumulative_cost;
    summary[symbol].current_cost_per_share = summary[symbol].current_investment / summary[symbol].current_shares;


    await axios.get('https://finnhub.io/api/v1/quote', {
      params: {
        symbol: symbol,
        token: process.env.REACT_APP_FINNHUB_KEY
      }
    }).then(result => {
      console.info("Got quote for " + symbol);
      // console.log(result)
      summary[symbol].quote = result.data;

      summary[symbol].unrealized_gain_loss = (summary[symbol].quote.c - summary[symbol].current_cost_per_share) * summary[symbol].current_shares;
      summary[symbol].unrealized_gain_loss_perc = summary[symbol].unrealized_gain_loss / summary[symbol].current_investment
      summary[symbol].current_market_value = summary[symbol].current_investment + summary[symbol].unrealized_gain_loss;

    }).catch((error) => {
      console.info("Failed to get quote for " + symbol);
      console.log(error);
    });
  }

  return summary;
}
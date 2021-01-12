
import { ExitToApp } from "@material-ui/icons";
import moment from "moment";
function onSignOut() {
    console.log("Signing out");
}

export const def_menu_items = [
    { name: "Log out", icon: <ExitToApp />, callback: onSignOut }
]

/* ID Must not be changed and be unique */
export const def_trans_types = {
    default: 1000,
    ref: {
        1000: "Buy",
        1005: "Sell",
        1010: "Split",
        1015: "Div",
        1020: "Fee",
    }
};

export const def_empty_transaction = {
    date: moment(),
    symbol: null,
    type: def_trans_types.default,
    units: "",
    price: "",
    fees: "",
    split: ""
}
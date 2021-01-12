
import { useEffect, useState } from "react";
import { def_trans_types } from "./Defaults";

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


export function useTransactionState() {
  const [transaction, setTransaction] = useState({
    date: new Date(),
    symbol: null,
    type: def_trans_types.default,
    units: "",
    price: "",
    fees: "",
    split: ""
  })
  return [transaction, setTransaction]
}
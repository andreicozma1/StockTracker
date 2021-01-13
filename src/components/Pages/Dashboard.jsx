import { useEffect, useState } from 'react';
import PortCostVal from '../Dashes/PortCostVal';
import UnrReaGL from '../Dashes/UnrReaGL';
import { fetchSummary } from '../Utils';


const axios = require("axios");

function Dashboard({ transactions, setTransactions }) {
    console.log("Rendering page Dashboard");

    const [unrGL, setUnrGL] = useState(0);
    const [totalInvesment, setTotalInvestment] = useState(0);

    useEffect(async () => {

        const summary = await fetchSummary(transactions);
        console.log("SUMMARY");
        console.log(summary)

        console.log(Object.values(summary).reduce((total, obj) => (obj.unrealized_gain_loss ? obj.unrealized_gain_loss : 0) + total, 0))
        console.log(Object.values(summary).reduce((total, obj) => (obj.current_investment ? obj.current_investment : 0) + total, 0))

        // setUnrGL(Object.values(summary).reduce((total, obj) => (obj.unrealized_gain_loss ? obj.unrealized_gain_loss : 0) + total), 0)
        // setTotalInvestment(Object.values(summary).reduce((total, obj) => (obj.current_investment ? obj.current_investment : 0) + total), 0)
        console.log("set states");

    }, [transactions])

    return (
        <div>
            <PortCostVal totalCost={totalInvesment} unrGL={unrGL} />
            <UnrReaGL />
        </div>
    );
}

export default Dashboard;
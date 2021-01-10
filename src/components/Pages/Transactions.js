
import NewTransaction from "../Sections/NewTransactions";
import PastTransactions from "../Sections/PastTransactions";

function Transactions() {

    const handleAddTrans = (transaction) => {
        console.log(transaction);
    }

    return (
        <div>
            <NewTransaction onClick={handleAddTrans} />
            <PastTransactions />
        </div>
    )
}


export default Transactions;
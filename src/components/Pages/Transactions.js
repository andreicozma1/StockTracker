
import NewTransaction from "../Sections/NewTransactions";
import PastTransactions from "../Sections/PastTransactions";

function Transactions(){
    return (
        <div>
            <NewTransaction/>
            <PastTransactions/>
        </div>
    )
}


export default Transactions;
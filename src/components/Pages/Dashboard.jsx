import PortCostVal from '../Dashes/PortCostVal';
import UnrReaGL from '../Dashes/UnrReaGL';

function Dashboard() {
    console.log("Rendering page Dashboard");
    return (
        <div>
            <PortCostVal />
            <UnrReaGL />
        </div>
    );
}

export default Dashboard;
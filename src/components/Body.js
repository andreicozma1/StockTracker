import Dashboard from './Pages/Dashboard'
import Stock from './Pages/Stock'
import Error from './Pages/Error'

function Body(props) {
    
    const page = props.currentPage;

    var RenderPage = Error;
    console.log("Body: New page is " + page);
    switch(page) {
        case "Dashboard":
            RenderPage = Dashboard;
            break;
        case "Summary":
            RenderPage = Stock;
            break;
        default:
            console.log("Body: Defaulting to Error page");
            RenderPage = Error;
            break;
    }

    return (
        <RenderPage/>
    );
}

export default Body;
import {useState} from 'react'
import Header from './components/Header';
import Body from './components/Body';
import { Container } from '@material-ui/core'

const defaultPage = "Dashboard";

export default function App() {
  
  const[currentPage, setCurrentPage] = useState(defaultPage)
  
  console.log("App: rendering " + currentPage);

  return (

    <Container maxWidth='lg'>
        <Header defaultPage={defaultPage} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        <Body currentPage={currentPage}/>
    </Container>

  );
}

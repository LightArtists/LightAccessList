import {Container} from "react-bootstrap";
import {AddressTable} from "./AddressTable";
import "react-datepicker/dist/react-datepicker.css";
import { DropPhases } from "./DropPhases";


function App() {
  return (
   <Container className={'big-container'}>
     <DropPhases/>
   </Container>
  );
}

export default App;

import {Container} from "react-bootstrap";
import {AddressTable} from "./AddressTable";
import "react-datepicker/dist/react-datepicker.css";
import { DropPhases } from "./DropPhases";
import { PhaseProvider } from "./PhaseContext";


function App() {
  return (
   <Container className={'big-container'}>
     <PhaseProvider>
        <DropPhases/>
     </PhaseProvider>     
   </Container>
  );
}

export default App;

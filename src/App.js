import {Container} from "react-bootstrap";
import {AddressTable} from "./AddressTable";
import "react-datepicker/dist/react-datepicker.css";
import { DropPhases } from "./DropPhases";
import { PhaseProvider } from "./PhaseContext";
import { PasswordGenerator } from "./PasswordGenerator";


function App() {
  return (
   <Container className={'big-container'}>
     <PhaseProvider>
        <DropPhases/>
        <PasswordGenerator/>
     </PhaseProvider>     
   </Container>
  );
}

export default App;

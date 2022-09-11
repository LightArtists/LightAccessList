import "antd/dist/antd.css";
import { Container } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { PhaseProvider } from "./modules/PhaseContext";
import { CollectionProvider } from "./modules/CollectionContext";
import { Collections } from "./components/collections-list/Collections";
import { ToastContainer } from "react-toast";
import { Main } from "./components/Main";

function App() {
  return (
    <div>
      <Container className={"big-container"}>
        <CollectionProvider>
          <PhaseProvider>
            <Main />
          </PhaseProvider>
        </CollectionProvider>
      </Container>
      <ToastContainer delay={6000} />
    </div>
  );
}

export default App;

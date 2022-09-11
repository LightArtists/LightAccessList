import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Row,
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import { uid } from "uid";
import Web3 from "web3";
import DatePicker from "react-datepicker";
import CSVReader from "react-csv-reader";
import { parseAddressesCSV } from "../../utils/data";
import { usePhaseContext } from "../../modules/PhaseContext";

const papaparseOptions = {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
};

export const AddressTable = ({ phase }) => {
  window.web3 = Web3;

  const {
    addAddressToPhase,
    removeAddressFromPhase,
    setAddressesToPhase,
    updatePhaseAccessListItem,
    generateMercleTreeForPhase,
    updatePhase,
  } = usePhaseContext();

  const [row, setRow] = useState(phase.users || []);
  const [checkAddress, setCheckAddress] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [price, setPrice] = useState(new Date());

  const addNewRow = useCallback(() => {
    addAddressToPhase(phase.index, {
      address: "",
      quantity: "",
      hash: "",
      id: uid(),
    });
  }, [phase, addAddressToPhase]);

  const removeRow = useCallback(
    (id) => {
      removeAddressFromPhase(phase.index, id);
    },
    [phase, phase.accessList, removeAddressFromPhase]
  );

  const addAddress = useCallback(
    (id, value) => {
      updatePhaseAccessListItem(phase.index, id, { address: value });
    },
    [phase, phase.accessList, updatePhaseAccessListItem]
  );

  const addQuantity = useCallback(
    (id, value) => {
      updatePhaseAccessListItem(phase.index, id, { quantity: value });
    },
    [phase, phase.accessList, updatePhaseAccessListItem]
  );

  const clickHandler = useCallback(() => {
    generateMercleTreeForPhase(phase.index);
  }, [row, generateMercleTreeForPhase]);

  const onFileLoaded = useCallback(
    (data, fileInfo, originalFile) => {
      const parsedData = parseAddressesCSV(data);
      setAddressesToPhase(phase.index, parsedData);
    },
    [setRow, phase, setAddressesToPhase]
  );

  return (
    <Container>
      <div className={"pt-5"}>
        {!!phase.warning && (
          <Alert variant={"warning"} className={"text-center pointer"}>
            {phase.warning}
          </Alert>
        )}
      </div>
      <Row>
        <Col>
          <p>Drop Phase Start Date / {phase.startDate.toLocaleString()}</p>
          <DatePicker
            selected={phase.startDate}
            showTimeSelect
            timeFormat="HH:mm"
            onChange={(date) => updatePhase(phase.index, { startDate: date })}
          />
        </Col>
        <Col>
          <p>Price in eth</p>
          <FormControl
            type="number"
            step={0.1}
            value={phase.price}
            onChange={({ target }) =>
              updatePhase(phase.index, { price: target.value })
            }
          />
          {phase.priceInWei && <p className="small">Wei: {phase.priceInWei}</p>}
        </Col>
        <Col>
          <p>Is Public</p>
          <Form.Check
            type="switch"
            checked={phase.isPublic}
            onChange={() =>
              updatePhase(phase.index, { isPublic: !phase.isPublic })
            }
          />
        </Col>
      </Row>
      {!phase.isPublic && (
        <>
          <CSVReader
            onFileLoaded={onFileLoaded}
            parserOptions={papaparseOptions}
          />
          <div className="address-table">
            <Table striped bordered hover size="md">
              <thead className={"address-table-header"}>
                <tr>
                  <th>#</th>
                  <th>Address</th>
                  <th>Access Quantity</th>
                  <th>Leaf</th>
                  <th>Hash</th>
                </tr>
              </thead>
              <tbody>
                {phase.accessList.map((item, i) => {
                  let classname = "";
                  if (item.warn) {
                    classname = "warning";
                  }
                  return (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td className={classname}>
                        <input
                          className="address-input"
                          type="text"
                          value={item.address}
                          onChange={(e) => addAddress(item.id, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity}
                          onChange={(e) => addQuantity(item.id, e.target.value)}
                        />
                      </td>
                      <td className={"break"}>{item.leafValue || "-"}</td>
                      <td className={"break"}>
                        {item.proof ? JSON.stringify(item.proof) : "-"}
                      </td>
                      <td className={"text-center"}>
                        <FontAwesomeIcon
                          icon={faMinusCircle}
                          onClick={() => removeRow(item.id)}
                          className={"clr pointer"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div>
            <Button className={"text-center"} onClick={addNewRow}>
              Add Address
              <FontAwesomeIcon icon={faPlusCircle} className={"clr pointer"} />
            </Button>
          </div>
        </>
      )}
      <div>
        <p>Hash: {phase.rootHash}</p>
        <p>Drop Data: {phase.phaseDropStr}</p>
      </div>
      <hr className="clr" />
      <div className={"text-center"}>
        <Button onClick={clickHandler} className={"generate-btn"}>
          Generate
        </Button>
      </div>
    </Container>
  );
};

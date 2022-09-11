import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { AddressTable } from "./AddressTable";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Accordion, Button } from "react-bootstrap";

export function DropPhase({ phase, onRemovePhase }) {
  const _onRemovePhase = useCallback(() => {
    onRemovePhase && onRemovePhase(phase);
  }, [phase, phase.index, onRemovePhase]);
  let info = phase.accessList && ` Addresses Count: ${phase.accessList.length}`;
  if (phase.isPublic) {
    info = " Public";
  }

  return (
    <Accordion.Item eventKey={phase.index}>
      <Accordion.Header>
        Drop Phase {phase.index}: {phase.price && `price: ${phase.price}`}{" "}
        {phase.date && `date: ${phase.date}`} - {info}
        <div className="header-button-group">
          <Button
            className="text-center"
            variant="danger"
            onClick={_onRemovePhase}
          >
            Remove Phase
            <FontAwesomeIcon
              icon={faMinusCircle}
              className="mr-4 clr pointer"
            />
          </Button>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <AddressTable phase={phase} />
      </Accordion.Body>
    </Accordion.Item>
  );
}

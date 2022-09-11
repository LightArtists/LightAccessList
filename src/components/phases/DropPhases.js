import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Accordion, Button } from "react-bootstrap";
import { DropPhase } from "./DropPhase";
import { usePhaseContext } from "../../modules/PhaseContext";

export function DropPhases() {
  const {
    phases,
    phasesData,
    onAddPhase,
    onRemovePhase,
    generateAndSaveJSON,
    saveDropPhases,
  } = usePhaseContext();

  const onSaveClicked = useCallback(() => {
    generateAndSaveJSON();
  }, [generateAndSaveJSON]);

  const onSaveDropPhasesClicked = useCallback(() => {
    saveDropPhases();
  }, [saveDropPhases]);

  return (
    <Accordion>
      {phases.map((phase) => (
        <DropPhase phase={phase} onRemovePhase={onRemovePhase} />
      ))}
      <div className="d-flex justify-content-center align-items-center mt-4">
        <p>Remix data: {phasesData.dropPhasesRemixStr}</p>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-4">
        <Button className={"text-center"} onClick={onAddPhase}>
          Add Phase
          <FontAwesomeIcon icon={faPlusCircle} className={"clr pointer"} />
        </Button>
        <Button onClick={onSaveClicked} className={"save-btn"}>
          Save As Json
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-4 ">
        <Button onClick={onSaveDropPhasesClicked} className={"save-btn"}>
          Save Drop Phases
        </Button>
      </div>
    </Accordion>
  );
}

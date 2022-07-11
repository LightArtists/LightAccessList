import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Accordion, Button } from "react-bootstrap";
import { DropPhase } from "./DropPhase";
import { usePhaseContext } from "./PhaseContext";

export function DropPhases() {
    const {
        phases,
        phasesData,
        onAddPhase,
        onRemovePhase,
        generateAndSaveJSON,
      } = usePhaseContext();

      const onSaveClicked = useCallback(() => {
        generateAndSaveJSON();
      }, [generateAndSaveJSON]);

    return (
        <Accordion>
            {
                phases.map((phase) => (<DropPhase phase={phase} onRemovePhase={onRemovePhase} />))
            }
            <div>
                <Button className={'text-center'} onClick={onAddPhase}>
                    Add Phase
                    <FontAwesomeIcon icon={faPlusCircle} className={'clr pointer'} />
                </Button>
                <Button onClick={onSaveClicked} className={'save-btn'}>
                    Save As Json
                </Button>
                <p>
                    Remix data: {phasesData.dropPhasesRemixStr}
                </p>
            </div>
        </Accordion>
    );
}
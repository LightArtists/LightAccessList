import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { AddressTable } from "./AddressTable";
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Accordion, Button } from "react-bootstrap";

export function DropPhases() {
    const [phases, setPhases] = useState([{}]);

    const onAddPhase = useCallback(() => {
        setPhases(pahsesArr => [...pahsesArr, {}])
    }, [setPhases]);

    const onRemovePhase = useCallback((phase) => {
        setPhases(phases => phases.filter(item => item !== phase))
    }, [setPhases]);

    return (
        <Accordion>
            {
                phases.map((phase, phaseIndex) => (
                    <Accordion.Item eventKey={phaseIndex}>
                        <Accordion.Header>Drop Phase {phaseIndex}: {phase.price && `price: ${phase.price}`}  {phase.date && `date: ${phase.date}`} 
                            <div className="header-button-group">
                                <Button className="text-center" variant="danger" onClick={() => onRemovePhase(phase)} >
                                    Remove Phase
                                    <FontAwesomeIcon icon={faMinusCircle} className='mr-4 clr pointer' />
                                </Button>
                            </div>                            
                        </Accordion.Header>                        
                        <Accordion.Body>
                            <AddressTable phase={phase}/>                
                        </Accordion.Body>
                    </Accordion.Item>
                ))
            }
            <div>
                <Button className={'text-center'} onClick={onAddPhase}>
                    Add Phase
                    <FontAwesomeIcon icon={faPlusCircle} className={'clr pointer'} />
                </Button>
            </div>
        </Accordion>
    );
}
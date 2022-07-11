import React, { useCallback, useState } from "react";

import { saveAs } from 'file-saver';
import { toMarkleTree } from "./utils/packing";
import Web3 from "web3";
import { publicByte32 } from "./utils/data";

export const PhaseContext = React.createContext({});

let counter = 1;
console.log("counter init: ", counter)

export const PhaseProvider = ({ children }) => {
    const [phases, setPhases] = useState([{ index: counter, accessList: [], startDate: new Date }]);
    const [phasesData, setPhasesData] = useState({});

    const onAddPhase = useCallback(() => {
        console.log("-counter: ", counter)
        counter++;
        setPhases(pahsesArr => [...pahsesArr, { index: counter, accessList: [], startDate: new Date  }])
        console.log("+counter: ", counter)
    }, [setPhases]);

    const onRemovePhase = useCallback((phase) => {
        setPhases(phases => phases.filter(item => item !== phase))
    }, [setPhases]);

    const getPhase = useCallback((index) => {
        return phases.find(item => item.index === index);
    }, [phases]);

    const updatePhase = useCallback((index, newPhase) => {
        const phaseIndex = phases.findIndex(item => item.index === index)
        if (newPhase.price) {
            newPhase.priceInWei = Web3.utils.toWei(newPhase.price)
        }
        phases[phaseIndex] = { ...phases[phaseIndex], ...newPhase };
        console.log("Phase update", phases[phaseIndex]);       
        setPhases([...phases])
    }, [phases]);

    const addAddressToPhase = useCallback((index, item) => {
        const phase = getPhase(index);
        phase.accessList = phase.accessList || [];
        phase.accessList.push(item);        
        updatePhase(index, {accessList: phase.accessList })
    }, [phases, getPhase, updatePhase]);

    
    const setAddressesToPhase = useCallback((index, addresses) => {
        const phase = getPhase(index);
        phase.accessList = addresses || [];
        updatePhase(index, {accessList: phase.accessList })
    }, [phases, getPhase, updatePhase]);

    const removeAddressFromPhase = useCallback((index, itemId) => {
        const phase = getPhase(index);
        phase.accessList = phase.accessList || [];
        phase.accessList = phase.accessList.filter(listItem => listItem.id !== itemId);  
        updatePhase(index, {accessList: phase.accessList })      
    }, [phases, getPhase, updatePhase]);

    const generateMercleTreeForPhase = useCallback((index) => {
        const phase = getPhase(index);
        let warning;

        if (!phase.price) {
            updatePhase(index, {warning: "Please enther the price!" });
            return false;
        }

        if (!phase.startDate) {
            updatePhase(index, {warning: "Please enther correct start date!" });
            return false;
        }

        if (!phase.isPublic) {
            warning = phase.accessList.filter(item => !item.address || !item.quantity)
            if(warning.length){
                updatePhase(index, {warning: 'Fill in all fields!' })      
                return false;
            }
    
            let checkAddress = ''
            phase.accessList.forEach((item, i) => {
                item.warn = false;
                if(!Web3.utils.isAddress(item.address)){                
                    checkAddress += `${i+1},`;
                    item.warn = true;
                }
            });
    
            if(checkAddress.length){            
                updatePhase(index, {warning: `The address in row ${checkAddress} is not correct.`});
                return false;
            }
        }
                
        const publicAccessList = [publicByte32];
        let accessListProof = publicByte32;
        let newAccessList = phase.accessList;
        let accessListPhaseDrop = publicAccessList;
        if (!phase.isPublic) {
            const newArr = [...phase.accessList]
            const markleTreeData = toMarkleTree(newArr)        
            newAccessList = markleTreeData.data;
            accessListPhaseDrop = newAccessList.map(item => ({
                address: item.address,
                quantity: item.quantity,
                proof: item.proof,
            }))
            accessListProof = markleTreeData.root;
        }       

        const startTimestamp = parseInt(phase.startDate.getTime() / 1000);    
        updatePhase(index, {
            warning: "",
            accessList: newAccessList,
            rootHash: accessListProof,
            startTimestamp,
            phaseDrop: {
                isPublic: phase.isPublic,
                startTimestamp,
                price: phase.priceInWei,
                accessList: accessListPhaseDrop
            },
            phaseDropStr: `[${startTimestamp}, ${phase.priceInWei}, "${accessListProof}"]`
        })     
        return newAccessList;
    }, [phases, updatePhase, getPhase]);    

    const generateAndSaveJSON = useCallback(() => {
        const invalidPhase = phases.find(phase => generateMercleTreeForPhase(phase.index) === false);
        if (invalidPhase) {
            alert('Invalid phase exist. Please correct it and try again.')
            return;
        }

        let dropPhases = [];
        const srotedPhases = phases.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        let dropPhasesRemixStr = srotedPhases.reduce((prev, next) => {
            prev += next.phaseDropStr + ',';
            dropPhases.push(next.phaseDrop);
            return prev;
        }, '[');

        dropPhases = dropPhases.sort((a, b) => a.startTimestamp - b.startTimestamp)
        dropPhasesRemixStr = dropPhasesRemixStr.substring(0, dropPhasesRemixStr.length - 1) + ']';
        
        setPhasesData({
            dropPhasesRemixStr,
            dropPhases
        });

        const bytes = new TextEncoder().encode(JSON.stringify(dropPhases));
        var blob = new Blob([bytes], {type: "application/json;charset=utf-8"});
        saveAs(blob, "access-list.json");

    }, [phases, getPhase, generateMercleTreeForPhase]);

    const savePhasesJSON = useCallback((index) => {
        const phase = getPhase(index);
        if (!phase.accessList || !phase.accessList.length) {
            return;
        }
        const bytes = new TextEncoder().encode(JSON.stringify(phase.accessList));
        var blob = new Blob([bytes], {type: "application/json;charset=utf-8"});
        saveAs(blob, "access-list.json");
    }, [phases, getPhase]);

    const updatePhaseAccessListItem = useCallback((phaseIndex, itemId, item) => {
        const phase = getPhase(phaseIndex);
        phase.accessList = phase.accessList.concat();
        const itemIndex = phase.accessList.findIndex(listItem => listItem.id == itemId); 
        phase.accessList[itemIndex] = { ...phase.accessList[itemIndex], ...item };
        const newAccessList = phase.accessList.map((item) => ({
            ...item, leafValue: "", warn: false, proof: false
        }));
        updatePhase(phaseIndex, {accessList: newAccessList, rootHash: "" })
    }, [phases, getPhase]);


    return (
      <PhaseContext.Provider
        value={{
          phases,
          onAddPhase,
          savePhasesJSON,
          updatePhaseAccessListItem,
          onRemovePhase,
          addAddressToPhase,
          generateMercleTreeForPhase,
          setAddressesToPhase,
          updatePhase,
          phasesData,
          generateAndSaveJSON,
          removeAddressFromPhase
        }}
      >
        {children}
      </PhaseContext.Provider>
    );
  };
  
  export const usePhaseContext = () => React.useContext(PhaseContext);
import { Alert, Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useState } from 'react';
import { uid } from 'uid';
import Web3 from "web3";
import { packAddressAndQuantity, toMarkleTree } from './utils/Packing';
import CSVReader from 'react-csv-reader';
import { saveAs } from 'file-saver';

const papaparseOptions = {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
  }

export const AddressTable = () => {
    window.web3 = Web3;
    const [row, setRow] = useState([
    ])
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('')
    const [mainHash, setMainHash] = useState('-')
    const [checkAddress, setCheckAddress] = useState([])


    const addNewRow = useCallback(() => {
        setRow(prevState => {
            return [...prevState,{address:"", quantity:"", hash:"", id: uid()} ]
        })
    },[]);
    const removeRow = useCallback((id) => {
        const filter = row.filter((item,) => id !== item.id )
        if(!filter.length){
            setMainHash('')
        }
        setRow(filter)
    },[row]);
    const addAddress = useCallback((id, value) => {
        let newArr = [...row]
        newArr.forEach(item => {
            if(item.id === id){
                item.address = value
            }
        })
        setRow(newArr)
    },[row])
    const addQuantity = useCallback((id, value) => {

        let newArr = [...row]
        newArr.forEach(item => {
            if(item.id === id){
                item.quantity = value
            }
        })
        setRow(newArr)
    },[row])
    const toggleAlert = useCallback((bool) => {
        setShowAlert(bool)
    },[])

    const clickHandler = useCallback(() => {
        setCheckAddress([])
        const warning = row.filter(item => !item.address || !item.quantity)
        if(warning.length){
            toggleAlert(true)
            setAlertMessage('Fill in all fields!')
            return false;
        }
        let checkAddress = ''
        row.forEach((item,i) => {
            if(!Web3.utils.isAddress(item.address)){
                setCheckAddress(p => [...p, i])
                checkAddress += `${i+1},`
            }
        })
        if(checkAddress.length){
            toggleAlert(true)
            setAlertMessage(`The address in row ${checkAddress} is not correct.`)
            setTimeout(()=>{
                toggleAlert(false)
            }, 3000)
            return false;
        }
        let newArr = [...row]
        const markleTreeData = toMarkleTree(newArr)        
        setMainHash(markleTreeData.root)
        setRow(markleTreeData.data)
        console.log(markleTreeData)
        return markleTreeData.data;
    },[row])

    const onFileLoaded = useCallback((data, fileInfo, originalFile) => {
        console.log(data, fileInfo, originalFile)
        const newData = data.map((arr) => ({ address: arr[0], quantity: arr[1] }));
        if (isNaN(parseInt(data[0].quantity))) {
            newData.shift();
        }
        setRow(newData)

    }, [setRow])

    const onSaveClicked = useCallback(() => {
        const newRows = clickHandler();
        if (newRows === false) {
            return;
        }
        const bytes = new TextEncoder().encode(JSON.stringify(newRows));
        var blob = new Blob([bytes], {type: "application/json;charset=utf-8"});
        saveAs(blob, "access-list.json");
    }, [clickHandler])
    return (
        <Container>
            <div className={'pt-5'}>
                <Alert show={showAlert} variant={'warning'} className={'text-center pointer'} onClick={() => toggleAlert(false)}>
                    {alertMessage}
                </Alert>
            </div>
            <CSVReader onFileLoaded={onFileLoaded} parserOptions={papaparseOptions}/>            
            <Table striped bordered hover size="md">
                <thead className={'address-table-header'}>
                <tr>
                    <th>#</th>
                    <th>Address</th>
                    <th>Access Quantity</th>
                    <th>Leaf</th>
                    <th>Hash</th>
                </tr>
                </thead>
                <tbody>
                {
                    row.map((item, i) => {
                        let classname = ''
                        if(checkAddress.includes(i)){
                            classname = 'warning'
                        }
                        return (
                            <tr key={item.id} >
                                <td>{i+1}</td>
                                <td className={classname}>
                                    <input
                                        className='address-input'
                                        type='text'
                                        value={item.address}
                                        onChange={(e)=>addAddress(item.id,e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='number'
                                        className='quantity-input'
                                        value={item.quantity}
                                        onChange={(e)=>addQuantity(item.id,e.target.value)}
                                    />
                                </td>
                                <td className={'break'}>{item.leafValue || '-'}</td>
                                <td className={'break'}>{item.proof ? JSON.stringify(item.proof) : '-'}</td>
                                <td className={'text-center'}>
                                    <FontAwesomeIcon icon={faMinusCircle} onClick={() => removeRow(item.id)}  className={'clr pointer'} />
                                </td>
                            </tr>
                        )
                    })
                }

                </tbody>
            </Table>
            <div>
                <p className={'text-center'}>
                    <FontAwesomeIcon icon={faPlusCircle} onClick={addNewRow} className={'clr pointer'} />
                </p>
            </div>
            <div>
                <p>
                    Hash: {mainHash}
                </p>
            </div>
            <hr className='clr'/>
            <div className={'text-center'}>
                <button onClick={clickHandler} className={'generate-btn'}>
                    Generate
                </button>

                <button onClick={onSaveClicked} className={'save-btn'}>
                    Save As Json
                </button>
            </div>
        </Container>
    )
}

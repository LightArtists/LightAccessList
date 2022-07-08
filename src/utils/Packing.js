import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import web3 from "web3";

export function toMarkleTree(data) {
    const leafs = data.map((data) => {
        const {quantity, address} = data;
        return {
            ...data,
            leafValue: packAddressAndQuantity(address, quantity)
        };
    });    
    const tree = new MerkleTree(leafs.map(item => item.leafValue), keccak256, { sortPairs: true })
    const root = '0x' + tree.getRoot().toString('hex')
    const results = {
        root,
        data: leafs.map((data, index) => ({
            ...data,
            proof: tree.getHexProof(data.leafValue),
            proofPositional: tree.getPositionalHexProof(data.leafValue, index),
        }))
    }
    console.log("results", tree.toString()) // true
    console.log("results", results) // true
    return results;    
}

export function packAddressAndQuantity(address, quantity) {
    const addressAsNumberString = web3.utils.hexToNumberString(addressToBytes32(address));
    const addressBN = new web3.utils.BN(addressAsNumberString);
    const quantityAsNumberString = web3.utils.hexToNumberString(numberToBytes32(quantity));
    const quantityBN = new web3.utils.BN(quantityAsNumberString);
    const result = addressBN.or(quantityBN.shrn(160));
    return '0x' + result.toString(16);
}

function hexToHexBytes(hex, bytesLength) {
    const bytes = web3.utils.hexToBytes(hex);
    if (!bytesLength || bytesLength === bytes.length) {
        return bytes.concat([]);
    }

    if (bytesLength < bytes.length) {
        throw "Data will be lost";
    }
    while(bytesLength != bytes.length) {
        bytes.unshift(0);
    }
    return web3.utils.bytesToHex(bytes);
}

function bytesToBytesN(bytes, n) {
    if (!Array.isArray(bytes)) {
        bytes = web3.utils.hexToBytes(bytes);
    }
    const lengthDiff = n - bytes.length;
    if (lengthDiff < 0) {
        throw new Error("Data loss");
    }
    if (lengthDiff === 0) {
        return bytes.concat([]);
    }
    // lengthDiff bytes 0
    const emptyBytesN = '0'.repeat(lengthDiff).split('').map(i=>parseInt(i));
    // contact 2 bytes 
    const newBytes = bytes.concat(emptyBytesN);
    // create n bytes hex address
    return web3.utils.bytesToHex(newBytes);
}

function addressToBytes32(address) {
    // convert address string to bytes(20)
    const addressBytes20 = hexToHexBytes(address);
    return bytesToBytesN(addressBytes20, 32);
}

function numberToBytes32(num) {
    // convert number to hex
    const hex = web3.utils.toHex(num)
    const bytes12 = hexToHexBytes(hex, 12)
    const bytes32 = bytesToBytesN(bytes12, 32);
    return bytes32;
}
export const publicByte32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function parseCSV(data) {
    const newData = data.map((arr, index) => ({ address: arr[0], quantity: arr[1], id: index }));
    if (isNaN(parseInt(newData[0].quantity))) {
        newData.shift();
    }
    return newData;
}

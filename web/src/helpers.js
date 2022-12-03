export function setByArrayIndex(array, index, value) {
    let array_copy = JSON.parse(JSON.stringify(array));
    array_copy[index] = value
    return array_copy;
}

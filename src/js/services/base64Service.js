"use strict";

function isAllValidCharacters(data, validChars) {
    let validCharsAsArray = validChars.split('');
    return data.split('').every(c => validCharsAsArray.includes(c));
}

export function isAllValidBinaryCharacters(data) {
    const binaryChars = "01";
    return isAllValidCharacters(data, binaryChars);
}

const Base64Lexicon = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_";
export function isAllValidBase64Characters(data) {
    return isAllValidCharacters(data, Base64Lexicon);
}

export function base64ToBinary(c) {
    let remaining = Base64Lexicon.indexOf(c);
    let result = "";
    for (let i = 5; i >= 0; i--) {
        const currPower = Math.pow(2, i);
        let currBit = "0";
        if (remaining >= currPower) {
            currBit = "1";
            remaining -= currPower;
        }
        result = result.concat(currBit);
    }
    return result;
}
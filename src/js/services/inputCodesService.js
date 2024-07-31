"use strict";

import * as Schemas from "../data/schemas.js";
import { viewTableConfig } from "../data/viewTableConfig.js";
import { Player } from "../model/player.js";

let currentInputLengths = [];
let currentSchemaVersions = new Set();

export function parseInputData(inputDataAll) {
    let players = [];
    currentInputLengths = [];
    currentSchemaVersions = new Set();
    inputDataAll.forEach(d => {
        const validated = parsePlayerInputData(d);
        if (validated != null) {
            players.push(validated);
        }
    });

    if (!validateGatheredData()) {
        return [];
    }

    return players;
}

function validateGatheredData() {
    let allOk = true;
    for (let i = 0; i < currentInputLengths.length; i++) {
        allOk = allOk && currentInputLengths && currentInputLengths[0] == currentInputLengths[i];
    }

    allOk = allOk && currentSchemaVersions.size == 1;

    return allOk;
}

function parsePlayerInputData(input) {
    if (input == "") {
        return null;
    }

    const playerInfoAsArray = parsePlayerInfoIntoArray(input);
    if (playerInfoAsArray.length < 2 || playerInfoAsArray.length > 3) {
        return null;
    }

    let player = new Player();
    player.name = parseUsername(playerInfoAsArray);
    player.schemaVersion = (playerInfoAsArray.length == 3) ? playerInfoAsArray[1] : 1; // old codes didn't have the schemaVersion baked in
    player.originalInput = playerInfoAsArray[playerInfoAsArray.length - 1];

    const schemaVersion = player.schemaVersion;
    if (!Schemas.isValidSchema(schemaVersion)) {
        return null;
    }

    currentSchemaVersions.add(schemaVersion)

    const playerCodeAsBinary = convertPlayerInputToBinary(player.originalInput, schemaVersion);
    if (!getValidInputSizes(schemaVersion).includes(playerCodeAsBinary.length)) {
        return null;
    }

    currentInputLengths.push(playerCodeAsBinary.length);

    player.binaryCode = playerCodeAsBinary;

    return player;
}

function convertPlayerInputToBinary(originalUserInput, schemaVersion) {
    // this allows the user to input binary codes directly
    if (isAllValidBinaryCharacters(originalUserInput)) {
        return originalUserInput;
    }

    if (!isAllValidBase64Characters(originalUserInput)) {
        return "";
    }

    let decoded = "";
    for (let i = 0; i < originalUserInput.length; i++) {
        let binary = base64ToBinary(originalUserInput[i]);
        decoded = decoded.concat(binary);
    }

    const validInputSizes = getValidInputSizes(schemaVersion);
    for (let j = 0; j < validInputSizes.length; j++) {
        if (decoded.length > validInputSizes[j] && decoded.length - validInputSizes[j] < 6) {
            decoded = decoded.substring(0, decoded.length - (decoded.length - validInputSizes[j]));
            break;
        }
    }

    return decoded;
}

function isAllValidCharacters(data, validChars) {
    let validCharsAsArray = validChars.split('');
    return data.split('').every(c => validCharsAsArray.includes(c));
}

function isAllValidBinaryCharacters(data) {
    const binaryChars = "01";
    return isAllValidCharacters(data, binaryChars);
}

const Base64Lexicon = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_";
function isAllValidBase64Characters(data) {
    return isAllValidCharacters(data, Base64Lexicon);
}

function base64ToBinary(c) {
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


function getValidInputSizes(schemaVersion) {
    const supportedTypes = Object.keys(viewTableConfig);
    let validSizes = [];
    for (let type of supportedTypes) {
        validSizes.push(getValidInputSizeForType(schemaVersion, type));
    }
    return validSizes;
}

// only exported for tests
export function getValidInputSizeForType(schemaVersion, type) {
    const data = Schemas.getData(schemaVersion, viewTableConfig[type].databaseEntriesType);
    let total = 0;
    for (let row of data) {
        total += row["CODES"].length;
    }
    return total;
}

export function getSchemaVersion() {
    if (currentSchemaVersions.size > 1) {
        return 1; // fallback to using 1
    }

    return [...currentSchemaVersions][0];
}

function parsePlayerInfoIntoArray(unparsedString) {
    return unparsedString.split(":");
}

function parseUsername(playerInfoAsArray) {
    return escapeHTML(playerInfoAsArray[0]);
}

function escapeHTML(unsafestring) {
    return $('<div>').text(unsafestring).html();
}

"use strict";

import * as Schemas from "../data/schemas.js";
import { viewTableConfig } from "../data/viewTableConfig.js";
import { Player } from "../model/player.js";

var currentInputLengths = [];
var currentSchemaVersions = new Set();

export function parseInputData(inputDataAll) {
    var players = [];
    currentInputLengths = [];
    currentSchemaVersions = new Set();
    inputDataAll.forEach(d => {
        var validated = parsePlayerInputData(d);
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
    var allOk = true;
    for (var i = 0; i < currentInputLengths.length; i++) {
        allOk = allOk && currentInputLengths && currentInputLengths[0] == currentInputLengths[i];
    }

    allOk = allOk && currentSchemaVersions.size == 1;

    return allOk;
}

function parsePlayerInputData(input) {
    if (input == "") {
        return null;
    }

    var playerInfoAsArrayTmp = parsePlayerInfoIntoArray(input);
    if (playerInfoAsArrayTmp.length < 2 || playerInfoAsArrayTmp.length > 3) {
        return null;
    }

    var player = new Player();
    player.name = parseUsername(playerInfoAsArrayTmp);
    player.schemaVersion = (playerInfoAsArrayTmp.length == 3) ? playerInfoAsArrayTmp[1] : 1; // old codes didn't have the schemaVersion baked in
    player.originalInput = playerInfoAsArrayTmp[playerInfoAsArrayTmp.length - 1];

    const schemaVersion = player.schemaVersion;
    if (!Schemas.isValidSchema(schemaVersion)) {
        return null;
    }

    currentSchemaVersions.add(schemaVersion)

    var playerCodeAsBinary = convertPlayerInputToBinary(player.originalInput, schemaVersion);
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

    var decoded = "";
    for (var i = 0; i < originalUserInput.length; i++) {
        let binary = base64ToBinary(originalUserInput[i]);
        decoded = decoded.concat(binary);
    }

    const validInputSizes = getValidInputSizes(schemaVersion);
    for (var j = 0; j < validInputSizes.length; j++) {
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
    var binaryChars = "01";
    return isAllValidCharacters(data, binaryChars);
}

const Base64Lexicon = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_";
function isAllValidBase64Characters(data) {
    return isAllValidCharacters(data, Base64Lexicon);
}

function base64ToBinary(c) {
    var remaining = Base64Lexicon.indexOf(c);
    var result = "";
    for (var i = 5; i >= 0; i--) {
        var currPower = Math.pow(2, i);
        var currBit = "0";
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
    var total = 0;
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

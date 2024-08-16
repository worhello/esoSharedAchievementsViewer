"use strict";

import * as Schemas from "../data/schemas.js";
import { viewTableConfig } from "../data/viewTableConfig.js";
import { Player } from "../model/player.js";
import * as Base64Service from "./base64Service.js";

export function parseInputData(inputDataAll, category) {
    let result = {};
    result.category = category;
    result.players = [];
    result.schemaVersion = -1;
    result.isValid = false;

    let currentInfo = {};
    currentInfo.currentInputLengths = [];
    currentInfo.currentSchemaVersions = new Set();

    inputDataAll.forEach(input => {
        const validated = parsePlayerInputData(currentInfo, input);
        if (validated != null) {
            result.players.push(validated);
        }
    });

    if (!validateGatheredData(currentInfo)) {
        return [];
    }

    result.schemaVersion = getSchemaVersionFromInput(currentInfo);

    result.isValid = true;

    return result;
}

function validateGatheredData(result) {
    let allOk = true;
    for (let i = 0; i < result.currentInputLengths.length; i++) {
        allOk = allOk && result.currentInputLengths && result.currentInputLengths[0] == result.currentInputLengths[i];
    }

    allOk = allOk && result.currentSchemaVersions.size == 1;

    return allOk;
}

function parsePlayerInputData(result, input) {
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

    result.currentSchemaVersions.add(schemaVersion)

    const playerCodeAsBinary = convertPlayerInputToBinary(player.originalInput, schemaVersion);
    if (!getValidInputSizes(schemaVersion).includes(playerCodeAsBinary.length)) {
        return null;
    }

    result.currentInputLengths.push(playerCodeAsBinary.length);

    player.binaryCode = playerCodeAsBinary;

    return player;
}

function convertPlayerInputToBinary(originalUserInput, schemaVersion) {
    // this allows the user to input binary codes directly
    if (Base64Service.isAllValidBinaryCharacters(originalUserInput)) {
        return originalUserInput;
    }

    if (!Base64Service.isAllValidBase64Characters(originalUserInput)) {
        return "";
    }

    let decoded = "";
    for (let i = 0; i < originalUserInput.length; i++) {
        let binary = Base64Service.base64ToBinary(originalUserInput[i]);
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

function getSchemaVersionFromInput(result) {
    if (result.currentSchemaVersions.size > 1) {
        return 1; // fallback to using 1
    }

    return [...result.currentSchemaVersions][0];
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

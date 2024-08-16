"use strict";

import { viewTableConfig } from "../data/viewTableConfig.js";

function getKey(category, usePreviousValueKey) {
    return usePreviousValueKey ? `dataInput_previous_${category}` : `dataInput_${category}`
}

function readDataFromLocalStorage(category, readFromPreviousValueKey) {
    return localStorage.getItem(getKey(category, readFromPreviousValueKey));
}

export function readDataFromPreviousLocalStorage(category) {
    return readDataFromLocalStorage(category, true);
}

function writeDataToLocalStorage(category, writeToPreviousValueKey, data) {
    localStorage.setItem(getKey(category, writeToPreviousValueKey), data);
}

export function loadDataFromLocalStorage() {
    Object.keys(viewTableConfig).forEach(category => {
        const stored = readDataFromLocalStorage(category, false);
        if (stored) {
            $("#dataInput_" + category).html(stored);
        }
    });
}

export function storeInputDataToLocalStorage() {
    Object.keys(viewTableConfig).forEach(category => {
        const v = $("#dataInput_" + category).val();
        if (v) {
            // First write any existing data to the 'previous' key
            const currentLocalStorageVal = readDataFromLocalStorage(category, false);
            if (currentLocalStorageVal) {
                writeDataToLocalStorage(category, true, currentLocalStorageVal);
            }
            // Then write the new data to the 'current' key
            writeDataToLocalStorage(category, false, v);
        }
    });
}

export function clearInputDataFromLocalStorage() {
    Object.keys(viewTableConfig).forEach(category => {
        localStorage.removeItem(getKey(category, false));
        localStorage.removeItem(getKey(category, true));
    });
}

function clearInputs() {
    Object.keys(viewTableConfig).forEach(category => {
        $("#dataInput_" + category).html("");
    });
}

export function deleteLocalStorageDataWithConfirmation() {
    if (window.confirm("Do you really want to clear the local cache? This will clear all input boxes' current values!")) {
        clearInputDataFromLocalStorage();
        clearInputs();
        return true;
    }

    return false;
}

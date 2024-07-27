"use strict";

import { viewTableConfig } from "../data/viewTableConfig.js";

export function loadDataFromLocalStorage() {
    Object.keys(viewTableConfig).forEach(category => {
        var stored = localStorage.getItem("dataInput_" + category);
        if (stored) {
            $("#dataInput_" + category).html(stored);
        }
    });
}

export function storeInputDataToLocalStorage() {
    Object.keys(viewTableConfig).forEach(category => {
        var v = $("#dataInput_" + category).val();
        if (v) {
            localStorage.setItem("dataInput_" + category, v);
        }
    });
}

export function clearInputDataFromLocalStorage() {
    Object.keys(viewTableConfig).forEach(category => {
        var v = $("#dataInput_" + category).val();
        if (v) {
            localStorage.removeItem("dataInput_" + category, v);
        }
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

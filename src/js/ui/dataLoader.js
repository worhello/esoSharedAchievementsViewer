"use strict";

import * as LocalStorageUtil from "./localStorageUtil.js";
import { viewTableConfig } from "../data/viewTableConfig.js";

export function loadData() {
    const url = new URL(window.location.href);
    const hasType = url.searchParams.has("type");
    const hasData = url.searchParams.has("data");
    const paramType = url.searchParams.get("type");
    const mode = url.searchParams.get("mode");

    const isValidDataInUrl = hasData && hasType && (paramType in viewTableConfig);

    if (isValidDataInUrl && (!mode || mode == "all")) {
        loadDataIntoInput(paramType, url.searchParams.get("data"));
        return;
    }

    LocalStorageUtil.loadDataFromLocalStorage();

    if (isValidDataInUrl && mode == "update") {
        loadUpdatedDataFromUrlIfPresent(url, paramType);
    }
}


function loadDataIntoInput(paramType, fullInput) {
    $(`input[value$='${paramType}']`).trigger('click');
    $(`#dataInput_${paramType}`).html(fullInput);
    $("#generateViewButtonId").trigger('click');
    return true;
}

function loadUpdatedDataFromUrlIfPresent(url, paramType) {
    const inputDataAll = formatDataFromInput($(`#dataInput_${paramType}`).val());

    const updatedData = url.searchParams.get("data");
    const userName = updatedData.split(":")[0];

    const indexToUpdate = inputDataAll.findIndex(dataArr => { return dataArr.split(":")[0] == userName });

    let newInputData = inputDataAll;
    if (indexToUpdate == -1) {
        newInputData = newInputData.concat([updatedData]);
    } else {
        newInputData[indexToUpdate] = updatedData;
    }

    const fullInput = newInputData.join("\n");
    loadDataIntoInput(paramType, fullInput);
}

export function formatDataFromInput(input) {
    return input
        .split("\n")
        .join(",")
        .split("\r")
        .join(",")
        .split(",");
}

export function populateShareUrl(category, baseUrl) {
    const url = new URL(baseUrl);
    url.searchParams.append("type", category);
    url.searchParams.append("data", $(`#dataInput_${category}`).val());

    $("#copyUrlModalBody").html(url.toString());
}

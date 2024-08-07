"use strict";

import * as SummaryGraph from "./ui/summaryGraph.js";
import * as InputCodesService from "./services/inputCodesService.js";
import * as ModalUtil from "./ui/modalUtil.js";
import * as TableViewController from "./ui/tableViewController.js";
import * as LocalStorageUtil from "./ui/localStorageUtil.js";
import * as DataLoader from "./ui/dataLoader.js";



function getBaseUrl() {
    if (window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")) {
        return window.location.origin;
    }

    // Just hardcoding for now to get this feature working properly
    return "https://worhello.github.io/esoSharedAchievementsViewer/";
}

function gatherInputData(inputName) {
    const inputDataAll = DataLoader.readDataFromInput(inputName);

    const data = InputCodesService.parseInputData(inputDataAll);

    if (data.length > 0) {
        LocalStorageUtil.storeInputDataToLocalStorage();
    }

    return data;
}

function handleOptionsButtonClicked(buttonVal) {
    $("#generateButtonsContainer").show();
    $("button.desc").hide();
    $("#val_" + buttonVal).show();
    $("#generateViewButtonId").val(buttonVal);

    $("#inputsContainer").show();
    $("#inputsContainer textarea").hide();
    $("#viewsContainer").hide();
    $("#playerNamesContainer").hide();
    $("#dataInput_" + buttonVal).show();
    $("#metadataContainer").hide();

    SummaryGraph.resetGraphChart();
}

function handleGenerateViewButtonClicked(selectedCategory) {
    const inputData = gatherInputData(selectedCategory);
    if (inputData.length == 0) {
        window.alert("Invalid data detected");
        return;
    }

    $(".extraDataModalDungeonInfoRow").remove();
    $(".summaryInfoHeaderRow").remove();
    $(".summaryInfoModalDungeonInfoRow").remove();

    $("div.view").hide();
    $("#generateButtonsContainer").hide();
    $("#inputsContainer").hide();
    $("#viewsContainer").show();
    $("#playerNamesContainer").show();
    $("#metadataContainer").show();

    let schemaVersion = InputCodesService.getSchemaVersionFromInput();

    TableViewController.populateTable(schemaVersion, selectedCategory, inputData);

    DataLoader.populateShareUrl(selectedCategory, getBaseUrl());

    $("#" + selectedCategory + "View").show();
}

$(document).ready(function() {
    $("input[name$='options']").click(function() {
        handleOptionsButtonClicked($(this).val());
    });

    $("button[name$='generateViewButtons']").click(function() {
        handleGenerateViewButtonClicked($(this).val());
    });

    $("button[name$='resetLocalStorageButton']").click(function() {
        if (LocalStorageUtil.deleteLocalStorageDataWithConfirmation()) {
            handleOptionsButtonClicked("dlcDungeons");
        }
    });

    $("button[name$='showSummaryViewButton']").click(function() {
        ModalUtil.showSummaryViewModal();
    });

    // Doing this dynamically allows for different URLs when run locally
    $("#navbarTitleLink").attr("href", getBaseUrl());

    DataLoader.loadData();

    $(function () {
        $('#resetLocalStorageButton').hover(function(){
            $(this).tooltip('hide');
        })
        $('#resetLocalStorageButton').tooltip()
    })
});
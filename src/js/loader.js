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

function parseInput(rawInput, category) {
    const formatted = DataLoader.formatDataFromInput(rawInput);
    return InputCodesService.parseInputData(formatted, category);
}

function handleOptionsButtonClicked(buttonVal) {
    $("#generateButtonsContainer").show();
    $("button.desc").hide();
    $(`#val_${buttonVal}`).show();
    $("#generateViewButtonId").val(buttonVal);

    $("#inputsContainer").show();
    $("#inputsContainer textarea").hide();
    $("#viewsContainer").hide();
    $("#playerNamesContainer").hide();
    $(`#dataInput_${buttonVal}`).show();
    $("#metadataContainer").hide();

    SummaryGraph.resetGraphChart();
}

function handleGenerateViewButtonClicked(selectedCategory) {
    const parsedInputResults = parseInput($(`#dataInput_${selectedCategory}`).val(), selectedCategory);
    if (!parsedInputResults.isValid) {
        window.alert("Invalid data detected");
        return;
    }

    LocalStorageUtil.storeInputDataToLocalStorage();

    updateUiForGenerateViewButtonClicked();

    TableViewController.populateTable(parsedInputResults);

    const previousRawInput = LocalStorageUtil.readDataFromPreviousLocalStorage(selectedCategory);
    if (previousRawInput) {
        const previousDataParsed = parseInput(previousRawInput, selectedCategory);
        TableViewController.populateNewAchievementsIfApplicable(previousDataParsed);
    }

    DataLoader.populateShareUrl(selectedCategory, getBaseUrl());

    $(`#${selectedCategory}View`).show();
}

function updateUiForGenerateViewButtonClicked() {
    $(".extraDataModalDungeonInfoRow").remove();
    $(".summaryInfoHeaderRow").remove();
    $(".summaryInfoModalDungeonInfoRow").remove();

    $("div.view").hide();
    $("#generateButtonsContainer").hide();
    $("#inputsContainer").hide();
    $("#viewsContainer").show();
    $("#playerNamesContainer").show();
    $("#metadataContainer").show();
}

$(document).ready(function() {
    $("input[name$='options']").click(function() {
        handleOptionsButtonClicked($(this).val());
    });

    $("button[name$='generateViewButtons']").click(function() {
        handleGenerateViewButtonClicked($(this).val());
    });

    $("button[name$='resetLocalStorageButton']").click(() => {
        if (LocalStorageUtil.deleteLocalStorageDataWithConfirmation()) {
            handleOptionsButtonClicked("dlcDungeons");
        }
    });

    $("button[name$='showSummaryViewButton']").click(() => {
        ModalUtil.showSummaryViewModal();
    });

    $("button[name$='showNewAchievementsViewButton']").click(() => {
        ModalUtil.showNewAchievementsViewModal();
    });

    $("#shareViewButton").click(() => {
        $("#copyUrlModalButton").text("Copy to clipboard");
    })
    
    
    $("#copyUrlModalButton").click(() => {
        navigator.clipboard.writeText($("#copyUrlModalBody").val());
        $("#copyUrlModalButton").text(`Copied!`);
    });

    // Doing this dynamically allows for different URLs when run locally
    $("#navbarTitleLink").attr("href", getBaseUrl());

    TableViewController.populateTableHeaders();

    DataLoader.loadData();
});
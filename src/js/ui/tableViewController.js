"use strict";

import { achievementInfos } from "../data/achievementInfos.js";
import { viewTableConfig } from "../data/viewTableConfig.js";
import * as InputCodesService from "../services/inputCodesService.js";
import * as TableService from "../services/tableService.js";
import * as ModalUtil from "./modalUtil.js";
import * as Schemas from "../data/schemas.js";
import * as SummaryGraph from "./summaryGraph.js";


// TODO investigate replacing this manual HTML creation with HTMl Templates
function createNameCell(c, parentElementId) {
    var cell = document.createElement("td");
    cell.id = parentElementId + c + "name";
    cell.dataset.toggle = "tooltip";
    cell.textContent = achievementInfos[c].dungeon;
    cell.setAttribute("scope", "row");
    cell.classList.add("dungeonNameCol");
    return cell;
}

function createMainViewCell(c, parentElementId) {
    var cell = document.createElement("td");
    cell.id = parentElementId + c;
    cell.dataset.toggle = "tooltip";
    if (c != "NIL") {
        cell.classList.add("dataCell")
        cell.setAttribute("achievementText", achievementInfos[c].name);
        cell.setAttribute("achievementDescription", achievementInfos[c].description);
        cell.setAttribute("achievementPoints", achievementInfos[c].points);
    }
    return cell;
}

function populateExtraDataModalRow(c, parentElementId, dungeonAbbv) {
    if (c == "NIL") {
        return;
    }

    var row = document.createElement("tr");
    row.classList.add("extraDataModalDungeonInfoRow"); // used to hide all rows
    row.classList.add(`${dungeonAbbv}_extraData`);
    row.setAttribute("extraDataModalDungeonAbbv", dungeonAbbv); // used to show only this dungeon's rows

    var titleCell = document.createElement("td");
    titleCell.innerHTML = achievementInfos[c].name;
    row.appendChild(titleCell);

    var descriptionCell = document.createElement("td");
    descriptionCell.innerHTML = achievementInfos[c].description;
    row.appendChild(descriptionCell);

    var completedByCell = createMainViewCell(c, parentElementId);
    completedByCell.id = `${completedByCell.id}_extraData`;
    row.appendChild(completedByCell);

    $("#extraDataTable").append(row);
}

function setupExtraDataModalButton(dungeonName, dungeonAbbv, parentElementId) {
    var cell = document.createElement("td");
    cell.classList.add("extraDataCol");

    var showModalButton = document.createElement("button");
    showModalButton.id = parentElementId + dungeonAbbv + "extraAchievementsButton";
    showModalButton.innerHTML = "More Details";
    showModalButton.classList.add("btn");
    showModalButton.classList.add("btn-sm");
    showModalButton.classList.add("btn-primary");
    showModalButton.onclick = function() {
        ModalUtil.showExtraDataModal(dungeonAbbv, dungeonName);
    }

    cell.appendChild(showModalButton);
    return cell;
}

function shouldExtraInfoBeShownInModal(dataRow, numDataColumnsInMainView) {
    let schemaVersion = InputCodesService.getSchemaVersion();
    if (schemaVersion && schemaVersion > 2) {
        return true;
    }

    return dataRow["CODES"].length > numDataColumnsInMainView;
}

function createTableRow(dataRow, numDataColumnsInMainView, parentElementId, numberOfPlayers) {
    var row = document.createElement("tr");
    var nameCellCreated = false;
    const extraDataModalNeeded = shouldExtraInfoBeShownInModal(dataRow, numDataColumnsInMainView);
    const numMainViewColumnsWithData = extraDataModalNeeded ? numDataColumnsInMainView - 1 : dataRow["CODES"].length;
    for (var i  = 0; i < numMainViewColumnsWithData; i++) {
        const c = dataRow["CODES"][i];
        if (nameCellCreated == false) {
            row.appendChild(createNameCell(c, parentElementId));
            nameCellCreated = true;
        }

        row.appendChild(createMainViewCell(c, parentElementId));
    }

    if (extraDataModalNeeded) {
        const dungeonAbbv = dataRow["ABBV"];
        const dungeonName = achievementInfos[dataRow["CODES"][0]].dungeon;
        row.appendChild(setupExtraDataModalButton(dungeonName, dungeonAbbv, parentElementId));
        let startingExtraDataIndex = 0;
        for (var j = startingExtraDataIndex; j < dataRow["CODES"].length; j++) {
            const c = dataRow["CODES"][j];
            populateExtraDataModalRow(c, parentElementId, dungeonAbbv);
        }
    }

    $(`#${parentElementId}_summaryColHeader`).attr("colspan", numberOfPlayers + 1);
    return row;
}

function createTableRows(data, dataType, numberOfPlayers) {
    const parentElementId = viewTableConfig[dataType].parentElementId;
    const numDataColumnsInMainView = viewTableConfig[dataType].numDataColumnsInMainView;

    $("#" + parentElementId).empty();
    for (let dataPoint of data) {
        $("#" + parentElementId).append(createTableRow(dataPoint, numDataColumnsInMainView, parentElementId, numberOfPlayers));
    }
}


const BucketColors = [
    "#DA4453CC",
    "#ED5565CC",
    "#FC6E51CC",
    "#FFCE54CC",
    "#A0D468CC",
    "#212529"
];

function getColorBucketFromPercent(percentValue) {
    if (percentValue < 0) return BucketColors[5];
    if (percentValue == 0) return BucketColors[0];
    if (percentValue == 100) return BucketColors[4];
    if (percentValue < 34) return BucketColors[1];
    if (percentValue > 67) return BucketColors[3];
    return BucketColors[2];
}

function setCellColorBasedOnPercentComplete(cellId, percentValue) {
    $(cellId).css({background: `${getColorBucketFromPercent(percentValue)}`})
}

function setListOfPlayersWithAchieveInTooltip(cellId, playersWhoHaveAchieve) {
    if (!$(cellId).attr("achievementText")) {
        return;
    }

    const achievementTitle = $(cellId).attr("achievementText");
    const achievementDescription = $(cellId).attr("achievementDescription");
    const achievementPoints = $(cellId).attr("achievementPoints");

    var playersSection = "";
    for (var i = 0; i < playersWhoHaveAchieve.length; i++) {
        var playerText = playersWhoHaveAchieve[i].name;
        playerText += playersWhoHaveAchieve[i].hasAchieve ? " ✔️" : " ❌";
        playersSection += `<p>${playerText}</p>`
    }

    var tooltipText = `<h2>${achievementTitle}</h2><br>`;
    tooltipText += `<p>${achievementDescription}</p><br>`;
    tooltipText += `${playersSection}`;
    tooltipText += `<h4>${achievementPoints}</h4>`;
    

    $(cellId).data("bs-toggle", "tooltip");
    $(cellId).attr("data-bs-html", "true");
    $(cellId).attr("title", tooltipText);
    $(cellId).hover(function(){
        $(this).tooltip('hide');
    })
    $(cellId).tooltip({trigger: "click"});
}

function generateDataSetsForGraph(allDungeonsAchievementsSummary, numPlayers) {
    var transformedDataMap = new Map();

    for (let dungeonName of allDungeonsAchievementsSummary.keys()) {
        let singleDungeonAchievementsSummary = allDungeonsAchievementsSummary.get(dungeonName);
        var results = {};
        results.totalNumAchievements = Array.from(singleDungeonAchievementsSummary.keys()).length;
        results.groupedByPlayerCount = new Map();
        for (let achievementCode of singleDungeonAchievementsSummary.keys()) {
            let playerCount = singleDungeonAchievementsSummary.get(achievementCode);
            if (!results.groupedByPlayerCount.has(playerCount)) {
                results.groupedByPlayerCount.set(playerCount, 0);
            }
            results.groupedByPlayerCount.set(playerCount, results.groupedByPlayerCount.get(playerCount) + 1);
        }

        transformedDataMap.set(dungeonName, results);
    }

    var dataArray = [];
    for (var i = numPlayers; i >= 0; i--) {
        var nPlayersHaveAchievement = [];
        let percentValue = Math.trunc((i / numPlayers) * 100);
        var perDungeonPerPlayersLabels = new Map();

        let prettifiedPlayersString = i == numPlayers ? `all players` :
            i == 0 ? `no players` :
            i == 1 ? `1 player` :
            `${i} players`

        for (let dungeon of transformedDataMap.keys()) {
            let dungeonData = transformedDataMap.get(dungeon);
            var rawValue = dungeonData.groupedByPlayerCount.get(i) || 0;
            let achievementCompletedPercent = (rawValue / dungeonData.totalNumAchievements) * 100;
            nPlayersHaveAchievement.push(achievementCompletedPercent);

            let adjustedVal = Math.trunc(achievementCompletedPercent * 100) / 100;
            var label = `Completed by ${prettifiedPlayersString}: ${rawValue} (${adjustedVal}%) out of ${dungeonData.totalNumAchievements}`
            perDungeonPerPlayersLabels.set(dungeon, label);
        }

        dataArray.push({
            label: `Completed by ${prettifiedPlayersString}`,
            data: nPlayersHaveAchievement,
            barThickness: 17,
            backgroundColor: getColorBucketFromPercent(percentValue),
            perDungeonPerPlayersLabels: perDungeonPerPlayersLabels
        });
    }

    return dataArray;
}

export function populateTable(schemaVersion, dataType, players) {
    const data = Schemas.getData(schemaVersion, viewTableConfig[dataType].databaseEntriesType);

    createTableRows(data, dataType, players.length);

    const parentElementId = viewTableConfig[dataType].parentElementId;
    var numPlayers = players.length;

    const model = TableService.buildTableModel(data, players);

    populateTableFromModel(model, parentElementId);
    const labels = Array.from(model.allDungeonsAchievementsSummary.keys());
    const graphDataSet = generateDataSetsForGraph(model.allDungeonsAchievementsSummary, numPlayers);
    SummaryGraph.setupSummaryGraph(labels, graphDataSet);

    $("#playerNamesContainer").html(model.headerText);
}

function populateTableFromModel(model, parentElementId) {
    for (let achievement of model.achievementsList) {
        let cellId = "#" + parentElementId + achievement.code;

        setCellColorBasedOnPercentComplete(cellId, -1);
        if (!achievement.isAchievement) { //represents cells with no actual achievement, need to grey out the boxes
            continue;
        }

        let cellsToUpdate = [
            `${cellId}`, `${cellId}_extraData`
        ];
        for (let id of cellsToUpdate) {
            if ($(id).length) {
                $(id).html(achievement.cellText);
                setListOfPlayersWithAchieveInTooltip(id, achievement.playersWhoHaveAchieve);
                setCellColorBasedOnPercentComplete(id, achievement.completedPercent);
            }
        }
    }
}
"use strict";

import { viewTableConfig, achievementCategoryHeaderText } from "../data/viewTableConfig.js";
import * as TableService from "../services/tableService.js";
import * as ModalUtil from "./modalUtil.js";
import * as Schemas from "../data/schemas.js";
import * as SummaryGraph from "./summaryGraph.js";


// TODO investigate replacing this manual HTML creation with HTMl Templates
function createNameCell(dungeonAbbv, dungeonName, parentElementId) {
    let cell = document.createElement("td");
    cell.id = `${parentElementId}${dungeonAbbv}name`;
    cell.dataset.toggle = "tooltip";
    cell.textContent = dungeonName;
    cell.setAttribute("scope", "row");
    cell.classList.add("dungeonNameCol");
    return cell;
}

function createMainViewCell(mainViewCell, parentElementId) {
    const achievementCode = mainViewCell.code;
    let cell = document.createElement("td");
    cell.id = `${parentElementId}${achievementCode}`;
    cell.dataset.toggle = "tooltip";
    if (achievementCode != "NIL") {
        cell.classList.add("dataCell")
        cell.setAttribute("achievementText", mainViewCell.name);
        cell.setAttribute("achievementDescription", mainViewCell.description);
        cell.setAttribute("achievementPoints", mainViewCell.points);
        if (mainViewCell.hasPlayerTitle) {
            cell.setAttribute("achievementPlayerTitle", mainViewCell.playerTitle);
        }
    }
    return cell;
}

function populateExtraDataModalRow(cell, parentElementId, dungeonAbbv) {
    if (cell.code == "NIL") {
        return;
    }

    let row = document.createElement("tr");
    row.id = `rowId_${cell.code}_extraData`;
    row.classList.add("extraDataModalDungeonInfoRow"); // used to hide all rows
    row.classList.add(`${dungeonAbbv}_extraData`);
    row.setAttribute("extraDataModalDungeonAbbv", dungeonAbbv); // used to show only this dungeon's rows

    let titleCell = document.createElement("td");
    titleCell.innerHTML = cell.name;
    row.appendChild(titleCell);

    let descriptionCell = document.createElement("td");
    descriptionCell.innerHTML = cell.description;
    row.appendChild(descriptionCell);

    let completedByCell = createMainViewCell(cell, parentElementId);
    completedByCell.id = `${completedByCell.id}_extraData`;
    row.appendChild(completedByCell);

    $("#extraDataTable").append(row);
}

function setupExtraDataModalButton(dungeonName, dungeonAbbv, parentElementId) {
    let cell = document.createElement("td");
    cell.classList.add("extraDataCol");

    let showModalButton = document.createElement("button");
    showModalButton.id = `${parentElementId}${dungeonAbbv}extraAchievementsButton`;
    showModalButton.innerHTML = "More Details";
    showModalButton.classList.add("btn");
    showModalButton.classList.add("btn-sm");
    showModalButton.classList.add("btn-primary");
    showModalButton.onclick = () => {
        ModalUtil.showExtraDataModal(dungeonAbbv, dungeonName);
    }

    cell.appendChild(showModalButton);
    return cell;
}

function createTableRow(dataRow, parentElementId, numberOfPlayers) {
    let row = document.createElement("tr");
    const dungeonName = dataRow["DUNGEONNAME"];
    const dungeonAbbv = dataRow["ABBV"];

    row.appendChild(createNameCell(dungeonAbbv, dungeonName, parentElementId));

    for (const mainViewCell of dataRow["MAINVIEWLAYOUT"]) {
        row.appendChild(createMainViewCell(mainViewCell, parentElementId))
    }

    row.appendChild(setupExtraDataModalButton(dungeonName, dungeonAbbv, parentElementId));

    for (const cell of dataRow["EXTRAVIEWLAYOUT"]) {
        populateExtraDataModalRow(cell, parentElementId, dungeonAbbv);
    }

    $(`#${parentElementId}_summaryColHeader`).attr("colspan", numberOfPlayers + 1);
    return row;
}

function createTableRows(data, dataType, numberOfPlayers) {
    const parentElementId = viewTableConfig[dataType].parentElementId;

    $(`#${parentElementId}`).empty();
    for (let dataPoint of data) {
        $(`#${parentElementId}`).append(createTableRow(dataPoint, parentElementId, numberOfPlayers));
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
    const achievementPlayerTitle = $(cellId).attr("achievementPlayerTitle") ?? null;

    let playersSection = "";
    for (let i = 0; i < playersWhoHaveAchieve.length; i++) {
        let playerText = playersWhoHaveAchieve[i].name;
        playerText += playersWhoHaveAchieve[i].hasAchieve ? " ✔️" : " ❌";
        playersSection += `<p>${playerText}</p>`
    }

    let tooltipText = `<h2>${achievementTitle}</h2><br>`;
    tooltipText += `<p>${achievementDescription}</p><br>`;
    tooltipText += `${playersSection}`;

    if (achievementPlayerTitle) {
        tooltipText += `<h4>${achievementPlayerTitle}</h4>`;
    }

    tooltipText += `<h5>${achievementPoints}</h5>`;

    $(cellId).attr("data-bs-toggle", "tooltip");
    $(cellId).attr("data-trigger", "click");
    $(cellId).attr("data-bs-html", "true");
    $(cellId).attr("title", tooltipText);

    $(cellId).tooltip({trigger: "click"});
    $(cellId).on('show.bs.tooltip', function() {
        $(cellId).on('mouseleave', function() {
            $(cellId).tooltip('hide');
        });
    });
}

function generateDataSetsForGraph(allDungeonsAchievementsSummary, numPlayers) {
    let transformedDataMap = new Map();

    for (let dungeonName of allDungeonsAchievementsSummary.keys()) {
        let singleDungeonAchievementsSummary = allDungeonsAchievementsSummary.get(dungeonName);
        let results = {};
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

    let dataArray = [];
    for (let i = numPlayers; i >= 0; i--) {
        let nPlayersHaveAchievement = [];
        let percentValue = Math.trunc((i / numPlayers) * 100);
        let perDungeonPerPlayersLabels = new Map();

        let prettifiedPlayersString = i == numPlayers ? `all players` :
            i == 0 ? `no players` :
            i == 1 ? `1 player` :
            `${i} players`

        for (let dungeon of transformedDataMap.keys()) {
            let dungeonData = transformedDataMap.get(dungeon);
            const rawValue = dungeonData.groupedByPlayerCount.get(i) || 0;
            let achievementCompletedPercent = (rawValue / dungeonData.totalNumAchievements) * 100;
            nPlayersHaveAchievement.push(achievementCompletedPercent);

            let adjustedVal = Math.trunc(achievementCompletedPercent * 100) / 100;
            const label = `Completed by ${prettifiedPlayersString}: ${rawValue} (${adjustedVal}%) out of ${dungeonData.totalNumAchievements}`
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

export function populateTable(parsedInputResults) {
    const dataType = parsedInputResults.category;
    const { layoutData, model } = getDataAndModel(parsedInputResults, true);

    createTableRows(layoutData, dataType, parsedInputResults.players.length);

    const parentElementId = viewTableConfig[dataType].parentElementId;
    const numPlayers = parsedInputResults.players.length;

    populateTableFromModel(model, parentElementId);
    const labels = Array.from(model.allDungeonsAchievementsSummary.keys());
    const graphDataSet = generateDataSetsForGraph(model.allDungeonsAchievementsSummary, numPlayers);
    SummaryGraph.setupSummaryGraph(labels, graphDataSet);

    $("#playerNamesContainer").html(model.headerText);
}

function getDataAndModel(parsedInputResults, storeModel) {
    const dataType = parsedInputResults.category;

    let schemaData = Schemas.getData(parsedInputResults.schemaVersion, viewTableConfig[dataType].databaseEntriesType);

    const layoutData = TableService.buildLayoutData(schemaData, viewTableConfig[dataType].mainViewColumns);
    const model = TableService.buildTableModel(dataType, schemaData, parsedInputResults.players, storeModel);

    return { layoutData, model };
}

function populateTableFromModel(model, parentElementId) {
    for (let achievement of model.achievementsList) {
        let cellId = `#${parentElementId}${achievement.code}`;

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

export function populateNewAchievementsIfApplicable(previousData) {
    const { model } = getDataAndModel(previousData, false);
    const newAchievementsModel = TableService.generateModelForNewAchievements(previousData.category, model);

    if (!newAchievementsModel.showButton) {
        $("#showNewAchievementsViewButton").hide();
        return;
    }

    $("#showNewAchievementsViewButton").show();

    for (const dataRow of newAchievementsModel.achievementsList) {
        $(`#rowId_${dataRow.code}_extraData`).addClass("newAchievement");
    }
}

export function populateTableHeaders() {
    for (let category of Object.keys(viewTableConfig)) {
        const categoryConfig = viewTableConfig[category];
        $(`#${categoryConfig.headerParentElementId}`).append(buildNewTableHeaderRow(categoryConfig.firstColName, []));
        for (let achievementCategory of categoryConfig.mainViewColumns) {
            $(`#${categoryConfig.headerParentElementId}`).append(buildNewTableHeaderRow(achievementCategoryHeaderText[achievementCategory], ["fixedWidthCol"]));
        }
        $(`#${categoryConfig.headerParentElementId}`).append(buildNewTableHeaderRow("", ["extraDataCol"]));
    }
}

function buildNewTableHeaderRow(columnText, styles) {
    let cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = columnText;
    for (let style of styles) {
        cell.classList.add(style);
    }

    return cell;
}

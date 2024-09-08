"use strict";

import { achievementInfos } from "../data/achievementInfos.js";

const categoryModels = new Map();

class LayoutAchievementInfo {
    constructor(code) {
        this.code = code;
        this.isAchievement = true;
        this.name = "";
        this.description = "";
        this.points = 0;
        this.hasPlayer = false;
        this.playerTitle = "";
    }
}

class AchievementCompletedModel {
    constructor() {
        this.code = 0;
        this.isAchievement = true;
        this.completedPercent = 0.0;
        this.completedNumber = 0;
        this.playersWhoHaveAchieve = [];
        this.cellText = "";
    }
}

class TableModel {
    constructor() {
        this.achievementsList = []; // AchievementCompletedModel[]
        this.allDungeonsAchievementsSummary = new Map();
        this.headerText = "";
        this.dungeonMainViewCells = new Map();
    }
}

export function buildLayoutData(schemaData, mainViewCellOrder) {
    for(let dungeonSchemaData of schemaData) {
        dungeonSchemaData["DUNGEONNAME"] = achievementInfos[dungeonSchemaData["CODES"][0]].dungeon;

        let allCells = [];
        let mainViewCellsUnsorted = {};
        for (let code of dungeonSchemaData["CODES"]) {
            if (code === "NIL") {
                allCells.push(buildNilLayoutAchievementInfo());
                continue;
            }

            let fullAchievementInfo = achievementInfos[code];
            let layoutAchievementInfo = new LayoutAchievementInfo(code);
            layoutAchievementInfo.name = fullAchievementInfo.name;
            layoutAchievementInfo.description = fullAchievementInfo.description;
            layoutAchievementInfo.points = fullAchievementInfo.points;
            if (fullAchievementInfo.playerTitle) {
                layoutAchievementInfo.hasPlayer = true;
                layoutAchievementInfo.playerTitle = fullAchievementInfo.playerTitle;
            }

            allCells.push(layoutAchievementInfo);
            if (fullAchievementInfo.category) {
                mainViewCellsUnsorted[fullAchievementInfo.category] = layoutAchievementInfo;
            }
        }

        dungeonSchemaData["EXTRAVIEWLAYOUT"] = allCells;
        dungeonSchemaData["MAINVIEWLAYOUT"] = sortMainViewCells(mainViewCellsUnsorted, mainViewCellOrder);
    }
    return schemaData;
}

function buildNilLayoutAchievementInfo() {
    let nilLayoutAchievementInfo = new LayoutAchievementInfo("NIL");
    nilLayoutAchievementInfo.isAchievement = false;
    return nilLayoutAchievementInfo;
}

function sortMainViewCells(mainViewCellsUnsorted, mainViewCellOrder) {
    let mainViewCellsSorted = [];

    for (let category of mainViewCellOrder) {
        if (mainViewCellsUnsorted[category]) {
            mainViewCellsSorted.push(mainViewCellsUnsorted[category]);
        } else {
            mainViewCellsSorted.push(buildNilLayoutAchievementInfo())
        }
    }

    return mainViewCellsSorted;
}

export function buildTableModel(dataType, schemaData, players, storeModel) {
    const model = buildTableModelWithoutStoringModel(schemaData, players);

    if (storeModel) {
        categoryModels[dataType] = model;
    }

    return model;
}

function buildTableModelWithoutStoringModel(schemaData, players) {
    const tableModel = new TableModel();

    let currentAchievementIndex = -1; // start on -1 so first index checked is 0, caused by the early continue
    for (let row = 0; row < schemaData.length; row++) {
        const dungeonAchievementSummary = new Map();
        let dungeonName = "";

        for (const code of schemaData[row]["CODES"]){
            currentAchievementIndex++;

            const cellModel = buildCellModel(code, players, currentAchievementIndex);
            tableModel.achievementsList.push(cellModel);
            
            if (cellModel.isAchievement) {
                dungeonName = achievementInfos[code].dungeon;
                dungeonAchievementSummary.set(code, cellModel.completedNumber);
            }
        }

        tableModel.allDungeonsAchievementsSummary.set(dungeonName, dungeonAchievementSummary);
    }

    tableModel.headerText = players.map(p => p.name).join(", " );

    return tableModel;
}

function buildCellModel(code, players, currentAchievementIndex) {
    if (code == "NIL") {
        return buildNilCellModel();
    }

    const cellModel = new AchievementCompletedModel();
    cellModel.code = code;

    let totalCountForCell = 0;
    cellModel.playersWhoHaveAchieve = [];
    for (const player of players) {
        let val = parseInt(player.binaryCode[currentAchievementIndex])
        totalCountForCell += val;
        cellModel.playersWhoHaveAchieve.push({ "name": player.name, "hasAchieve": val == 1 });
    }

    cellModel.completedPercent = Math.trunc((totalCountForCell / players.length) * 100);
    cellModel.completedNumber = totalCountForCell;
    const achievementHasTitle = achievementInfos[code].playerTitle ? "*" : "";
    cellModel.cellText = `${cellModel.completedNumber}/${players.length}${achievementHasTitle}`;
    return cellModel;
}

function buildNilCellModel() {
    const cellModel = new AchievementCompletedModel();
    cellModel.code = "NIL";
    cellModel.isAchievement = false;
    cellModel.completedPercent = -1.0;
    return cellModel;
}


export function generateModelForNewAchievements(dataType, previousData) {
    
    let result = {};
    result.showButton = false;
    result.achievementsList = [];
    
    const currentData = categoryModels[dataType];
    
    // check if schemas differ
    if (currentData.achievementsList.length != previousData.achievementsList.length) {
        return result;
    }

    // check if players are different
    const currentPlayers = getPlayersSetFromHeaderText(currentData.headerText);
    const previousPlayers = getPlayersSetFromHeaderText(previousData.headerText);
    if (!currentPlayers.every(player => previousPlayers.includes(player)) || 
        !previousPlayers.every(player => currentPlayers.includes(player))) {
        return result;
    }

    result.achievementsList = getListOfChangedCompletionPercentAchievements(currentData, previousData);
    result.showButton = result.achievementsList.length > 0;

    return result;
}

function getPlayersSetFromHeaderText(headerText) {
    return headerText.split(",").map(str => str.toLowerCase().trim());
}

function getListOfChangedCompletionPercentAchievements(currentData, previousData) {
    let changedAchievements = [];

    for (const currentAchievementValue of currentData.achievementsList) {
        var previousAchievementValue = previousData.achievementsList.find(prev => prev.code === currentAchievementValue.code);
        if (currentAchievementValue.completedNumber > previousAchievementValue.completedNumber) {
            changedAchievements.push(currentAchievementValue);
        }
    }

    return changedAchievements;
}

"use strict";

import { achievementInfos } from "../data/achievementInfos.js";

const categoryModels = new Map();

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
        this.achievementsList = []; // list of AchievementCompletedModel
        this.allDungeonsAchievementsSummary = new Map();
        this.headerText = "";
    }
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

    const numPlayers = players.length;

    let currentAchievementIndex = -1; // start on -1 so first index checked is 0, caused by the early continue
    for (let row = 0; row < schemaData.length; row++) {
        const dungeonAchievementSummary = new Map();
        let dungeonName = "";

        for (const code of schemaData[row]["CODES"]){
            const cellModel = new AchievementCompletedModel();
            cellModel.code = code;
            currentAchievementIndex++;

            if (cellModel.code == "NIL") {
                cellModel.isAchievement = false;
                cellModel.completedPercent = -1.0;
                tableModel.achievementsList.push(cellModel);
                continue;
            }

            let totalCountForCell = 0;
            cellModel.playersWhoHaveAchieve = [];
            for (const player of players) {
                let val = parseInt(player.binaryCode[currentAchievementIndex])
                totalCountForCell += val;
                cellModel.playersWhoHaveAchieve.push({ "name": player.name, "hasAchieve": val == 1 });
            }

            cellModel.completedPercent = Math.trunc((totalCountForCell / numPlayers) * 100);
            cellModel.completedNumber = totalCountForCell;
            cellModel.cellText = `${cellModel.completedNumber}/${numPlayers}`;

            tableModel.achievementsList.push(cellModel);

            dungeonName = achievementInfos[code].dungeon;
            dungeonAchievementSummary.set(code, totalCountForCell);
        }

        tableModel.allDungeonsAchievementsSummary.set(dungeonName, dungeonAchievementSummary);
    }

    tableModel.headerText = players.map(p => p.name).join(", " );

    return tableModel;
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
        } else if (currentAchievementValue.completedNumber < previousAchievementValue.completedNumber) {
            console.log("something weird with " + JSON.stringify(currentAchievementValue) + " vs " + JSON.stringify(previousAchievementValue));
        }
    }

    return changedAchievements;
}

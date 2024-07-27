"use strict";

import { achievementInfos } from "../data/achievementInfos.js";

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

export function buildTableModel(data, players) {
    const tableModel = new TableModel();

    const numPlayers = players.length;

    var currentAchievementIndex = -1; // start on -1 so first index checked is 0, caused by the early continue
    for (var row = 0; row < data.length; row++) {
        var dungeonAchievementSummary = new Map();
        var dungeonName = "";

        for (const code of data[row]["CODES"]){
            const cellModel = new AchievementCompletedModel();
            cellModel.code = code;
            currentAchievementIndex++;

            if (cellModel.code == "NIL") {
                cellModel.isAchievement = false;
                cellModel.completedPercent = -1;
                continue;
            }

            var totalCountForCell = 0;
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
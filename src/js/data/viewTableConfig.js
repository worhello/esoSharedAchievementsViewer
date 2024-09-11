"use strict";

export const viewTableConfig = {
    "dlcDungeons": {
        "parentElementId": "dlcDungeonsTableBody",
        "databaseEntriesType": "dungeon",
        "mainViewColumns": ["VET", "HM", "SR", "ND", "CHA", "TRI", "EXT"],
        "headerParentElementId": "dicDungeonsTableHeader",
        "firstColName": "Dungeon"
    },
    "baseDungeons": {
        "parentElementId": "baseDungeonsTableBody",
        "databaseEntriesType": "baseDungeon",
        "mainViewColumns": ["VET", "HM", "SR", "ND"],
        "headerParentElementId": "baseDungeonsTableHeader",
        "firstColName": "Dungeon"
    },
    "trials": {
        "parentElementId": "trialsTableBody",
        "databaseEntriesType": "trial",
        "mainViewColumns": ["VET", "PHM1", "PHM2", "HM", "TRI"],
        "headerParentElementId": "trialsTableHeader",
        "firstColName": "Trial"
    },
}

export const achievementCategoryHeaderText = {
    "VET": "Veteran",
    "HM": "Hard Mode",
    "SR": "Speed Run",
    "ND": "No Death",
    "CHA": "Challenger",
    "TRI": "Trifecta",
    "PHM1": "Partial Hard Mode",
    "PHM2": "Partial Hard Mode",
    "EXT": "Extra"
};
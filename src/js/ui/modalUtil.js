"use strict";

export function showExtraDataModal(dungeonAbbv, dungeonName) {
    hideAllChildElements();
    $('#extraDataTable').show();

    $('.extraDataModalDungeonInfoRow').hide(); // hide all achievements
    $(`.${dungeonAbbv}_extraData`).show(); // show this dungeon's achievements

    $("#extraDataModalTitle").html(`Extra Achievements - ${dungeonName}`);
}

export function showSummaryViewModal() {
    hideAllChildElements();
    $('#summaryGraphContainer').show()
    $("#extraDataModalTitle").html(`Achievement Completion Summary`);
}

export function showNewAchievementsViewModal() {
    hideAllChildElements();
    $('#extraDataTable').show();

    $('.extraDataModalDungeonInfoRow').hide(); // hide all achievements
    $('.newAchievement').show();

    $("#extraDataModalTitle").html(`New Achievements`);
}

export function showCollectionsRewardsViewModal() {
    hideAllChildElements();
    $('#titlesMementosContainer').show();

    handleRewardsFilterClicked("all");

    $("#extraDataModalTitle").html(`Titles`);
}

export function handleRewardsFilterClicked(filter) {
    $('.completed').hide();
    $('.started').hide();
    $('.notStarted').hide();

    if (filter == "all") {
        $('.completed').show();
        $('.started').show();
        $('.notStarted').show();
    } else {
        $(`.${filter}`).show();
    }
}

function hideAllChildElements() {
    $('#summaryGraphContainer').hide()
    $('#extraDataTable').hide();
    $('#titlesMementosContainer').hide();
}
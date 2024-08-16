"use strict";

export function showExtraDataModal(dungeonAbbv, dungeonName) {
    $('#summaryGraphContainer').hide()
    $('#extraDataTable').show();

    $('.extraDataModalDungeonInfoRow').hide(); // hide all achievements
    $(`.${dungeonAbbv}_extraData`).show(); // show this dungeon's achievements

    $("#extraDataModalTitle").html(`Extra Achievements - ${dungeonName}`);
    showModal();
}

export function showSummaryViewModal() {
    $('#summaryGraphContainer').show()
    $('#extraDataTable').hide()
    $("#extraDataModalTitle").html(`Achievement Completion Summary`);

    showModal();
}

export function showNewAchievementsViewModal() {
    $('#summaryGraphContainer').hide()
    $('#extraDataTable').show();

    $('.extraDataModalDungeonInfoRow').hide(); // hide all achievements
    $('.newAchievement').show();

    $("#extraDataModalTitle").html(`New Achievements`);

    showModal();
}

function showModal() {
    const modalElement = document.querySelector('#extraDataModal');
    // Because we're not using webpack we need to specifically disable the warning here...
    // eslint-disable-next-line no-undef
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement)
    modal.show();
}
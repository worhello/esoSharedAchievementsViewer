"use strict";

export function showExtraDataModal(dungeonAbbv, dungeonName) {
    $('#summaryGraphContainer').hide()
    $('#extraDataTable').show()
    $('.extraDataModalDungeonInfoRow').hide();
    $(`.${dungeonAbbv}_extraData`).show();
    $("#extraDataModalTitle").html(`Extra Achievements - ${dungeonName}`);
    showModal();
}

export function showSummaryViewModal() {
    $('#summaryGraphContainer').show()
    $('#extraDataTable').hide()
    $("#extraDataModalTitle").html(`Achievement Completion Summary`);

    showModal();
}

function showModal() {
    var modalElement = document.querySelector('#extraDataModal');
    // Because we're not using webpack we need to specifically disable the warning here...
    // eslint-disable-next-line no-undef
    var modal = bootstrap.Modal.getOrCreateInstance(modalElement)
    modal.show();
}
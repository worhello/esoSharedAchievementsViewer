
class Player {
    constructor() {
        this.name = "";
        this.achievements = new Array();
    }
}

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
    var row = document.createElement("tr");
    row.classList.add("extraDataModalDungeonInfoRow"); // used to hide all rows
    row.classList.add(dungeonAbbv);
    row.setAttribute("extraDataModalDungeonAbbv", dungeonAbbv); // used to show only this dungeon's rows

    var titleCell = document.createElement("td");
    titleCell.innerHTML = achievementInfos[c].name;
    row.appendChild(titleCell);

    var descriptionCell = document.createElement("td");
    descriptionCell.innerHTML = achievementInfos[c].description;
    row.appendChild(descriptionCell);

    var completedByCell = createMainViewCell(c, parentElementId);
    row.appendChild(completedByCell);

    $("#extraDataTable").append(row);
}

function setupExtraDataModalButton(dungeonName, dungeonAbbv, parentElementId) {
    var cell = document.createElement("td");
    cell.classList.add("extraDataCol");

    var showModalButton = document.createElement("button");
    showModalButton.id = parentElementId + dungeonAbbv + "extraAchievementsButton";
    showModalButton.innerHTML = "Extra Achievements";
    showModalButton.classList.add("btn");
    showModalButton.classList.add("btn-sm");
    showModalButton.classList.add("btn-primary");
    showModalButton.onclick = function() {
        $('.extraDataModalDungeonInfoRow').hide();
        $(`.${dungeonAbbv}`).show();
        $("#extraDataModalTitleDungeon").html(dungeonName);
        var myModalEl = document.querySelector('#extraDataModal')
        var modal = bootstrap.Modal.getOrCreateInstance(myModalEl) 
        modal.show();
    }

    cell.appendChild(showModalButton);
    return cell;
}

function createTableRow(dataRow, numDataColumnsInMainView, parentElementId) {
    var row = document.createElement("tr");
    var nameCellCreated = false;
    const extraDataModalNeeded = dataRow["CODES"].length > numDataColumnsInMainView;
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
        for (var i = numMainViewColumnsWithData; i < dataRow["CODES"].length; i++) {
            const c = dataRow["CODES"][i];
            populateExtraDataModalRow(c, parentElementId, dungeonAbbv);
        }
    }
    return row;
}

function createTableRows(parentElementId, numDataColumnsInMainView, data) {
    $("#" + parentElementId).empty();
    for (var i = 0; i < data.length; i++) {
        $("#" + parentElementId).append(createTableRow(data[i], numDataColumnsInMainView, parentElementId));
    }
}

function buildDlcDungeonView(schemaVersion) {
    var numDataColumnsInMainView = 7;
    var data = schemas[schemaVersion].filter((instanceData) => instanceData["TYPE"] == "dungeon");

    createTableRows("dlcDungeonsTableBody", numDataColumnsInMainView, data);
}

function buildBaseDungeonView(schemaVersion) {
    var numDataColumnsInMainView = 4;
    var data = schemas[schemaVersion].filter((instanceData) => instanceData["TYPE"] == "baseDungeon");

    createTableRows("baseDungeonsTableBody", numDataColumnsInMainView, data);
}

function buildTrialsView(schemaVersion) {
    var numDataColumnsInMainView = 6;
    var data = schemas[schemaVersion].filter((instanceData) => instanceData["TYPE"] == "trial");

    createTableRows("trialsTableBody", numDataColumnsInMainView, data);
}

function buildViews(schemaVersion) {
    buildDlcDungeonView(schemaVersion);
    buildBaseDungeonView(schemaVersion);
    buildTrialsView(schemaVersion);
}

function isAllValidCharacters(data, validChars) {
    let validCharsAsArray = validChars.split('');
    return data.split('').every(c => validCharsAsArray.includes(c));
}

function isAllValidBinaryCharacters(data) {
    var binaryChars = "01";
    return isAllValidCharacters(data, binaryChars);
}

const Base64Lexicon = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_";
function isAllValidBase64Characters(data) {
    return isAllValidCharacters(data, Base64Lexicon);
}

function validateInputData(input) {
    if (input == "") {
        return null;
    }

    var playerInfoAsArrayTmp = parsePlayerInfoIntoArray(input);
    if (playerInfoAsArrayTmp.length < 2 || playerInfoAsArrayTmp.length > 3) {
        return null;
    }

    // This is needed to account for the fact that older addon versions won't include the version part, so we inject it 
    // here if it's not present, then we know after this that we definitely have A version
    var playerInfoAsArray = [];
    playerInfoAsArray[0] = playerInfoAsArrayTmp[0];
    if (playerInfoAsArrayTmp.length == 2) {
        playerInfoAsArray[1] = 1; // Default schema version
    } else {
        playerInfoAsArray[1] = playerInfoAsArrayTmp[1];
    }
    playerInfoAsArray[2] = playerInfoAsArrayTmp[playerInfoAsArrayTmp.length - 1];

    const schemaVersion = playerInfoAsArray[1];
    if (!(schemaVersion in schemas)) {
        return null;
    }

    currentSchemaVersions.add(schemaVersion)

    var rawAchievementData = parseRawAchievementDataFromInput(playerInfoAsArray, schemaVersion);
    if (!getValidInputSizes(schemaVersion).includes(rawAchievementData.length)) {
        return null;
    }

    isAllValidBinaryCharacters(rawAchievementData);

    currentInputLengths.push(rawAchievementData.length);

    playerInfoAsArray[playerInfoAsArray.length - 1] = rawAchievementData;

    return playerInfoAsArray.join(":");
}

function getValidInputSizes(schemaVersion) {
    const supportedTypes = ["dungeon", "baseDungeon", "trial"];
    let validSizes = [];
    for (let type of supportedTypes) {
        var data = schemas[schemaVersion].filter((instanceData) => instanceData["TYPE"] == type);
        var total = 0;
        for (let row of data) {
            total += row["CODES"].length;
        }
        validSizes.push(total);
    }
    return validSizes;
}

var currentInputLengths = [];
var currentSchemaVersions = new Set();

function validateGatheredData() {
    var allOk = true;
    for (var i = 0; i < currentInputLengths.length; i++) {
        allOk = allOk && currentInputLengths && currentInputLengths[0] == currentInputLengths[i];
    }

    allOk = allOk && currentSchemaVersions.size == 1;

    return allOk;
}

function gatherInputData(inputName) {
    var data = [];
    currentInputLengths = [];

    var inputDataAll = [];
    try {
        inputDataAll = $("#dataInput_" + inputName).val()
            .split("\n")
            .join(",")
            .split("\r")
            .join(",")
            .split(",");
    } catch(err) {
        console.error("invalid input from dataInput_" + inputName + ", " + err);
        return [];
    }
    currentInputLengths = [];
    currentSchemaVersions = new Set();
    inputDataAll.forEach(d => {
        var validated = validateInputData(d);
        if (validated != null) {
            data.push(validated);
        }
    });

    if (!validateGatheredData()) {
        return [];
    }
    
    storeInputDataToLocalStorage();

    return data;
}

function parsePlayerInfoIntoArray(unparsedString) {
    return unparsedString.split(":");
}

function escapeHTML(unsafestring) {
    return $('<div>').text(unsafestring).html();
}

function parseUsername(playerInfoAsArray, playerNum) {
    if (playerInfoAsArray.length > 1) {
        return escapeHTML(playerInfoAsArray[0]);
    }
    return "Player" + (playerNum + 1);
}

function parseRawAchievementData(playerInfoAsArray) {
    return playerInfoAsArray[playerInfoAsArray.length - 1];
}

function base64ToBinary(c) {
    var remaining = Base64Lexicon.indexOf(c);
    var result = "";
    for (var i = 5; i >= 0; i--) {
        var currPower = Math.pow(2, i);
        var currBit = "0";
        if (remaining >= currPower) {
            currBit = "1";
            remaining -= currPower;
        }
        result = result.concat(currBit);
    }
    return result;
}

function parseRawAchievementDataFromInput(playerInfoAsArray, schemaVersion) {
    let rawAchievementData = parseRawAchievementData(playerInfoAsArray);
    if (isAllValidBinaryCharacters(rawAchievementData)) {
        return rawAchievementData;
    }

    if (!isAllValidBase64Characters(rawAchievementData)) {
        return "";
    }

    var decoded = "";
    for (var i = 0; i < rawAchievementData.length; i++) {
        let binary = base64ToBinary(rawAchievementData[i]);
        decoded = decoded.concat(binary);
    }

    const validInputSizes = getValidInputSizes(schemaVersion);
    for (var i = 0; i < validInputSizes.length; i++) {
        if (decoded.length > validInputSizes[i] && decoded.length - validInputSizes[i] < 6) {
            decoded = decoded.substring(0, decoded.length - (decoded.length - validInputSizes[i]));
            break;
        }
    }

    return decoded;
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

function getTextColorFromPercent(percentValue) {
    if (percentValue < 0) return BucketColors[5];
    return "black";
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

    var playersSection = "";
    for (var i = 0; i < playersWhoHaveAchieve.length; i++) {
        var playerText = playersWhoHaveAchieve[i].name;
        playerText += playersWhoHaveAchieve[i].hasAchieve ? " ✔️" : " ❌";
        playersSection += `<p>${playerText}</p>`
    }

    var tooltipText = `<h2>${achievementTitle}</h2><br>`;
    tooltipText += `<p>${achievementDescription}</p><br>`;
    tooltipText += `${playersSection}`;


    $(cellId).data("bs-toggle", "tooltip");
    $(cellId).attr("data-bs-html", "true");
    $(cellId).attr("title", tooltipText);
    $(cellId).hover(function(){
        $(this).tooltip('hide');
    })
    $(cellId).tooltip({trigger: "click"});
}

function parseDataForOnePlayer(unparsedString, totalNumEncounters, subArraySize, playerNum) {
    var player = new Player();

    var playerInfoAsArray = parsePlayerInfoIntoArray(unparsedString);
    player.name = parseUsername(playerInfoAsArray, playerNum);
    player.achievements = parseRawAchievementData(playerInfoAsArray);

    return player;
}

function splitCombinedEncounterDataForAllPlayers(fullArray, subArraySize) {
    var allPlayersData = new Array();
    for (var playerNum = 0; playerNum < fullArray.length; playerNum++) {
        var totalNumEncounters = fullArray[playerNum].length / subArraySize;
        allPlayersData.push(parseDataForOnePlayer(fullArray[playerNum], totalNumEncounters, subArraySize, playerNum));
    }
    return allPlayersData;
}

function isNonAchievementCell(cellId) {
    if (!$(cellId).attr("achievementText")) {
        return true;
    }

    const permaNonAchieveCells = [
        "#dlcDungeonsTableBodycha0",
        "#dlcDungeonsTableBodycha28"
    ];
    return permaNonAchieveCells.includes(cellId);
}

function populateTable(data, parentElementId, inputData) {
    var numPlayers = inputData.length;

    var perEncounterArrays = splitCombinedEncounterDataForAllPlayers(inputData, data[0]["CODES"].length);

    var currentAchievementIndex = -1; // start on -1 so first index checked is 0, caused by the early continue
    for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row]["CODES"].length; col++) {
            let code = data[row]["CODES"][col];
            let cellId = "#" + parentElementId + code;
            currentAchievementIndex++;
            if (isNonAchievementCell(cellId)) {
                setCellColorBasedOnPercentComplete(cellId, -1);
                continue;
            }

            var totalCountForCell = 0;
            var playersWhoHaveAchieve = [];
            for (var p = 0; p < numPlayers; p++) {
                let val = parseInt(perEncounterArrays[p].achievements[currentAchievementIndex])
                totalCountForCell += val;
                playersWhoHaveAchieve.push({"name": perEncounterArrays[p].name, "hasAchieve": val == 1});
            }
            let percent = Math.trunc((totalCountForCell / numPlayers) * 100);
            $(cellId).html(totalCountForCell + "/" + numPlayers);
            setListOfPlayersWithAchieveInTooltip(cellId, playersWhoHaveAchieve);
            setCellColorBasedOnPercentComplete(cellId, percent);
        }
    }

    var allPlayerNames = "";
    for (var playerNum = 0; playerNum < numPlayers; playerNum++) {
        if (playerNum > 0) {
            allPlayerNames = allPlayerNames.concat(", ");
        }
        allPlayerNames = allPlayerNames.concat(perEncounterArrays[playerNum].name);
    }
    $("#playerNamesContainer").html(allPlayerNames);
}

function populateDlcDungeonsFromData(inputData, schemaVersion) {
    var data = schemas[schemaVersion].filter((instanceData) => instanceData["TYPE"] == "dungeon");
    var parentElementId = "dlcDungeonsTableBody";

    populateTable(data, parentElementId, inputData);
}

function populateBaseDungeonsFromData(inputData, schemaVersion) {
    var data = schemas[schemaVersion].filter((instanceData) => instanceData["TYPE"] == "baseDungeon");
    var parentElementId = "baseDungeonsTableBody";

    populateTable(data, parentElementId, inputData);
}

function populateTrialsFromData(inputData, schemaVersion) {
    var data = schemas[schemaVersion].filter((instanceData) => instanceData["TYPE"] == "trial");
    var parentElementId = "trialsTableBody";

    populateTable(data, parentElementId, inputData);
}

const InputCategories = [
    "dlcDungeons",
    "baseDungeons",
    "trials"
]

function loadDataFromLocalStorage() {
    InputCategories.forEach(category => {
        var stored = localStorage.getItem("dataInput_" + category);
        if (stored) {
            $("#dataInput_" + category).html(stored);
        }
    });
}

function storeInputDataToLocalStorage() {
    InputCategories.forEach(category => {
        var v = $("#dataInput_" + category).val();
        if (v) {
            localStorage.setItem("dataInput_" + category, v);
        }
    });
}

function clearInputDataFromLocalStorage() {
    InputCategories.forEach(category => {
        var v = $("#dataInput_" + category).val();
        if (v) {
            localStorage.removeItem("dataInput_" + category, v);
        }
    });
}

function clearInputs() {
    InputCategories.forEach(category => {
        $("#dataInput_" + category).html("");
    });
}

function getBaseUrl() {
    if (window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")) {
        return window.location.origin;
    }

    // Just hardcoding for now to get this feature working properly
    return "https://worhello.github.io/esoSharedPithkaViewer/";
}

function populateShareUrl(v) {
    var baseUrl = getBaseUrl();
    var url = new URL(baseUrl);
    url.searchParams.append("type", v);
    url.searchParams.append("data", $("#dataInput_" + v).val());

    var str = url.toString();
    $("#copyUrlModalBody").html(str);
    $("#copyUrlModalButton").click(function() {
        navigator.clipboard.writeText(str);
    });
}

function loadDataFromUrlIfPresent() {
    var url = new URL(window.location.href);
    var hasType = url.searchParams.has("type");
    var hasData = url.searchParams.has("data");
    if (!hasData || !hasType) {
        return false;
    }

    var paramType = url.searchParams.get("type");
    if (InputCategories.indexOf(paramType) == -1) {
        return false;
    }

    $("input[value$='" + paramType + "']").trigger('click');
    $("#dataInput_" + paramType).html(url.searchParams.get("data"));
    $("#val_" + paramType).trigger('click');
}

function handleOptionsButtonClicked(buttonVal) {
    $("#generateButtonsContainer").show();
    $("button.desc").hide();
    $("#val_" + buttonVal).show();
    
    $("#inputsContainer").show();
    $("#inputsContainer textarea").hide();
    $("#viewsContainer").hide();
    $("#playerNamesContainer").hide();
    $("#dataInput_" + buttonVal).show();
    $("#shareButtonContainer").hide();
}

function getSchemaVersion() {
    if (currentSchemaVersions.size > 1) {
        return 1; // fallback to using 1
    }

    return [...currentSchemaVersions][0];
}

function handleGenerateViewButtonClicked(v) {
    var inputData = gatherInputData(v);
    if (inputData.length == 0) {
        window.alert("Invalid data detected");
        return;
    }

    
    $(".extraDataModalDungeonInfoRow").remove();

    let schemaVersion = getSchemaVersion();
    buildViews(schemaVersion);

    $("div.view").hide();
    $("#generateButtonsContainer").hide();
    $("#inputsContainer").hide();
    $("#viewsContainer").show();
    $("#playerNamesContainer").show();
    $("#shareButtonContainer").show();

    if (v == "dlcDungeons") {
        populateDlcDungeonsFromData(inputData, schemaVersion);
    } else if (v == "baseDungeons") {
        populateBaseDungeonsFromData(inputData, schemaVersion);
    } else if (v == "trials") {
        populateTrialsFromData(inputData, schemaVersion);
    }

    populateShareUrl(v);

    $("#" + v + "View").show();
}

$(document).ready(function() {
    $("input[name$='options']").click(function() {
        handleOptionsButtonClicked($(this).val());
    });

    $("button[name$='generateViewButtons']").click(function() {
        handleGenerateViewButtonClicked($(this).val());
    });

    $("button[name$='resetLocalStorageButton']").click(function() {
        if (window.confirm("Do you really want to clear the local cache? This will also clear all input boxes' current values!")) {
            clearInputDataFromLocalStorage();
            clearInputs();
            handleOptionsButtonClicked("dlcDungeons");
        }
    });

    // Doing this dynamically allows for different URLs when run locally
    $("#navbarTitleLink").attr("href", getBaseUrl());

    if (!loadDataFromUrlIfPresent()) {
        loadDataFromLocalStorage();
    }

    $(function () {
        $('#resetLocalStorageButton').hover(function(){
            $(this).tooltip('hide');
        })
        $('#resetLocalStorageButton').tooltip()
    })
});
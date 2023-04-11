
const DlcDungeonCols = ["name", "vet", "hm", "sr", "nd", "cha", "tri", "ext"];
const DlcDungeonData = [
    {NAME:"White Gold Tower",     TRINAME: "n/a",                       EXTNAME: "Out of the Frying Pan", },
    {NAME:"Imperial City Prison", TRINAME: "n/a",                       EXTNAME: "Out of Sight",          },
    {NAME:"Ruins of Mazzatun",    TRINAME: "n/a",                       EXTNAME: "Obedience Training",    },
    {NAME:"Cradle of Shadows",    TRINAME: "n/a",                       EXTNAME: "Embrace the Shadow",    },
    {NAME:"Falkreath Hold",       TRINAME: "n/a",                       EXTNAME: "Epic Undertaking",      },
    {NAME:"Bloodroot Forge",      TRINAME: "n/a",                       EXTNAME: "Wildlife Sanctuary",    },
    {NAME:"Fang Lair",            TRINAME: "Leave No Bone Unbroken",    EXTNAME: "Minimal Animosity",     },
    {NAME:"Scalecaller Peak",     TRINAME: "Mountain God",              EXTNAME: "Daedric Deflector",     },
    {NAME:"Moon Hunter Keep",     TRINAME: "Pure Lunacy",               EXTNAME: "Strangling Cowardice",  },
    {NAME:"March of Sacrifices",  TRINAME: "Apex Predator",             EXTNAME: "Mist Walker",           },
    {NAME:"Frostvault",           TRINAME: "Relentless Raider",         EXTNAME: "Cold Potato",           },
    {NAME:"Depths of Malatar",    TRINAME: "Depths Defier",             EXTNAME: "Lackluster",            },
    {NAME:"Lair of Maarselok",    TRINAME: "Nature's Wrath",            EXTNAME: "Shagrath's Shield",     },
    {NAME:"Moongrave Fane",       TRINAME: "Defanged the Devourer",     EXTNAME: "Drop the Block",        },
    {NAME:"Icereach",             TRINAME: "Storm Foe",                 EXTNAME: "Prodigous Pacification",},
    {NAME:"Unhallowed Grave",     TRINAME: "Bonecaller's Bane",         EXTNAME: "Relentless Dogcatcher", },
    {NAME:"Stone Garden",         TRINAME: "True Genius",               EXTNAME: "Old Fashioned",         },
    {NAME:"Castle Thorn",         TRINAME: "Bane of Thorns",            EXTNAME: "Guardian Preserved",    },
    {NAME:"Black Drake Villa",    TRINAME: "Ardent Bibliophile",        EXTNAME: "Salley-oop",            },
    {NAME:"The Cauldron",         TRINAME: "Subterranean Smasher",      EXTNAME: "Can't Catch Me",        },
    {NAME:"Red Petal Bastion",    TRINAME: "of the Silver Rose",        EXTNAME: "Terror Billy",          },
    {NAME:"Dread Cellar",         TRINAME: "the Dreaded",               EXTNAME: "Settling Scores",       },    
    {NAME:"Coral Aerie",          TRINAME: "Coral Caretaker",           EXTNAME: "Tentacless Triumph",    },
    {NAME:"Shipwright's Regret",  TRINAME: "Privateer",                 EXTNAME: "Sans Spirit Support",   },
    {NAME:"Earthen Root Enclave", TRINAME: "Invaders' Bane",            EXTNAME: "Scourge of Archdruid",  },
    {NAME:"Graven Deep",          TRINAME: "Fist of Tava",              EXTNAME: "Pressure in the Deep",  },
    {NAME:"Bal Sunnar",           TRINAME: "Temporal Tempest",          EXTNAME: "Infectious Beliefs",    },
    {NAME:"Scrivener's Hall",     TRINAME: "Magnastylus in the Making", EXTNAME: "Harsh Edit",            },

    {NAME: "Blackrose Prison ",   TRINAME: "Unchained", EXTNAME: "A Thrilling Trifecta"}
];

const BaseDungeonCols = ["name", "vet", "hm", "sr", "nd"];
const BaseDungeonData = [
    {NAME: "Fungal Grotto I",     },
    {NAME: "Fungal Grotto II",    },
    {NAME: "Banished Cells I",    },
    {NAME: "Banished Cells II",   },
    {NAME: "Elden Hollow I",      },
    {NAME: "Elden Hollow II",     },
    {NAME: "City of Ash I",       },
    {NAME: "City of Ash II",      },
    {NAME: "Crypt of Hearts I",   },
    {NAME: "Crypt of Hearts II",  },
    {NAME: "Darkshade Caverns I", },
    {NAME: "Darkshade Caverns II",},
    {NAME: "Spindleclutch I",     },
    {NAME: "Spindleclutch II",    },
    {NAME: "Wayrest Sewers I",    },
    {NAME: "Wayrest Sewers II",   },
    {NAME: "Arx Corinium",        },
    {NAME: "Blackheart Haven",    },
    {NAME: "Blessed Crucible",    },
    {NAME: "Direfrost Keep",      },
    {NAME: "Selene's Web",        },
    {NAME: "Tempest Island",      },
    {NAME: "Vaults of Madness",   },
    {NAME: "Volenfell",           }
];


const TrialCols = ["name", "vet", "phm1", "phm2", "hm", "tri", "ext"];
const TrialData = [
    {NAME:"Hel Ra Citadel",         PHM1NAME:"n/a",      PHM2NAME:"n/a",     HMNAME:"Celest. Warrior", TRINAME:"n/a",                 EXTNAME:"n/a"                     },
    {NAME:"Aetherian Archive",      PHM1NAME:"n/a",      PHM2NAME:"n/a",     HMNAME:"Celest. Mage",    TRINAME:"n/a",                 EXTNAME:"n/a"                     },
    {NAME:"Sanctum Ophidia",        PHM1NAME:"n/a",      PHM2NAME:"n/a",     HMNAME:"Celest. Serpent", TRINAME:"n/a",                 EXTNAME:"n/a"                     },
    {NAME:"Maw of Lorkhaj",         PHM1NAME:"n/a",      PHM2NAME:"n/a",     HMNAME:"Rakkhat",         TRINAME:"n/a",                 EXTNAME:"Dro-m'Athra Destroyer"},
    {NAME:"Halls of Fabrication",   PHM1NAME:"n/a",      PHM2NAME:"n/a",     HMNAME:"Assembly Gen.",   TRINAME:"Tick-Tock Tormentor", EXTNAME:"The Dynamo"           },
    {NAME:"Asylum Sanctorium",      PHM1NAME:"+Llothis", PHM2NAME:"+Felms",  HMNAME:"vAS +2",          TRINAME:"Saintly Savior",      EXTNAME:"Immortal Redeemer"    },
    {NAME:"Cloudrest",              PHM1NAME:"vCR +1",   PHM2NAME:"vCR +2",  HMNAME:"vCR +3",          TRINAME:"Gryphon Heart",       EXTNAME:"Welkynar Liberator"   },
    {NAME:"Sunspire",               PHM1NAME:"Yolna",    PHM2NAME:"Lokke",   HMNAME:"Nahvi",           TRINAME:"Godslayer",           EXTNAME:"Hand of Alkosh"       },
    {NAME:"Kyne's Aegis",           PHM1NAME:"Yandir",   PHM2NAME:"Vrol",    HMNAME:"Falgravn",        TRINAME:"Kyne's Wrath",        EXTNAME:"Dawnbringer"          },
    {NAME:"Rockgrove",              PHM1NAME:"Oaxiltso", PHM2NAME:"Bahsei",  HMNAME:"Xalvakka",        TRINAME:"Planesbreaker",       EXTNAME:"Daedric Bane"         },
    {NAME:"Dreadsail Reef",         PHM1NAME:"Twins",    PHM2NAME:"Reef",    HMNAME:"Taleria",         TRINAME:"Soul of the Squall",  EXTNAME:"Swashbuckler Supreme" }
];

class Player {
    constructor() {
        this.name = "";
        this.achievements = new Array();
    }
}

function createTableRow(num, dataRow, cols, parentElementId) {
    var row = document.createElement("tr");
    cols.forEach((c) => {
        var cell = document.createElement("td");
        cell.id = parentElementId + c + num;
        if (c == "name") {
            cell.textContent = dataRow.NAME;
            cell.setAttribute("scope", "row");
            cell.classList.add("dungeonNameCol")
        }
        if (c == "tri" && dataRow.TRINAME != null) {
            cell.setAttribute("achievementText", dataRow.TRINAME);
            cell.setAttribute("title", dataRow.TRINAME);
        }
        if (c == "ext" && dataRow.EXTNAME != null) {
            cell.setAttribute("achievementText", dataRow.EXTNAME);
            cell.setAttribute("title", dataRow.EXTNAME);
        }
        if (c == "phm1" && dataRow.PHM1NAME != null) {
            cell.setAttribute("achievementText", dataRow.PHM1NAME);
            cell.setAttribute("title", dataRow.PHM1NAME);
        }
        if (c == "phm2" && dataRow.PHM2NAME != null) {
            cell.setAttribute("achievementText", dataRow.PHM2NAME);
            cell.setAttribute("title", dataRow.PHM2NAME);
        }
        if (c == "hm" && dataRow.HMNAME != null) {
            cell.setAttribute("achievementText", dataRow.HMNAME);
            cell.setAttribute("title", dataRow.HMNAME);
        }
        row.appendChild(cell);
    });
    return row;
}

function createTableRows(parentElementId, data, cols) {
    for (var i = 0; i < data.length; i++) {
        $("#" + parentElementId).append(createTableRow(i, data[i], cols, parentElementId));
    }
}

function buildDlcDungeonView() {
    var data = DlcDungeonData;
    var cols = DlcDungeonCols;

    createTableRows("dlcDungeonsTableBody", data, cols);
}

function buildBaseDungeonView() {
    var data = BaseDungeonData;
    var cols = BaseDungeonCols;

    createTableRows("baseDungeonsTableBody", data, cols);
}

function buildTrialsView() {
    var data = TrialData;
    var cols = TrialCols;

    createTableRows("trialsTableBody", data, cols);
}

function buildViews() {
    buildDlcDungeonView();
    buildBaseDungeonView();
    buildTrialsView();
}

function isValidCharacter(c) {
    return c == '0' || c == '1';
}

function validateInputData(input) {
    if (input == "") {
        return false;
    }

    var validInputSizes = [
        DlcDungeonData.length * (DlcDungeonCols.length - 1),
        BaseDungeonData.length * (BaseDungeonCols.length - 1),
        TrialData.length * (TrialCols.length - 1)
    ];

    var playerInfoAsArray = parsePlayerInfoIntoArray(input);
    if (playerInfoAsArray.length > 2) {
        return false;
    }

    var rawAchievementData = parseRawAchievementData(playerInfoAsArray);

    if (!validInputSizes.includes(rawAchievementData.length)) {
        return false;
    }

    for (var i = 0; i < rawAchievementData.length; i++) {
        if (!isValidCharacter(rawAchievementData[i])) {
            return false;
        }
    }

    currentInputLengths.push(rawAchievementData.length);

    return true;
}

var currentInputLengths = [];

function validateGatheredData() {
    var allOk = true;
    for (var i = 0; i < currentInputLengths.length; i++) {
        allOk = currentInputLengths && currentInputLengths[0] == currentInputLengths[i];
    }
    return allOk;
}

function gatherInputData() {
    var data = [];
    currentInputLengths = [];
    for (var i = 0; i < 12; i++) {
        if ($("#dataInput" + i).css('display') != "none" && validateInputData($("#dataInput" + i).val())) {
            data.push($("#dataInput" + i).val());
        }
    }
    if (!validateGatheredData(data)) {
        return [];
    }
    return data;
}

function parsePlayerInfoIntoArray(unparsedString) {
    return unparsedString.split(":");
}

function parseUsername(playerInfoAsArray, playerNum) {
    if (playerInfoAsArray.length > 1) {
        return playerInfoAsArray[0];
    }
    return "Player " + (playerNum + 1);
}

function parseRawAchievementData(playerInfoAsArray) {
    if (playerInfoAsArray.length > 1) {
        return playerInfoAsArray[1];
    }
    return playerInfoAsArray[0];
}

function parseDataForOnePlayer(unparsedString, totalNumEncounters, subArraySize, playerNum) {
    var player = new Player();
    var currPlayerDataPtr = 0;

    var playerInfoAsArray = parsePlayerInfoIntoArray(unparsedString);
    player.name = parseUsername(playerInfoAsArray, playerNum);
    var rawAchievementData = parseRawAchievementData(playerInfoAsArray);

    for (var currEncounter = 0; currEncounter < totalNumEncounters; currEncounter++) {
        player.achievements[currEncounter] = new Array();
        for (var j = 0; j < subArraySize; j++) {
            player.achievements[currEncounter].push(rawAchievementData[currPlayerDataPtr]);
            currPlayerDataPtr++;
        }
    }
    return player;
}

function splitCombinedEncounterDataForAllPlayers(fullArray, subArraySize) {
    var allPlayersData = new Array();
    for (var playerNum = 0; playerNum < fullArray.length; playerNum++) {
        var totalNumEncounters = fullArray[playerNum].length / subArraySize;
        allPlayersData[playerNum] = parseDataForOnePlayer(fullArray[playerNum], totalNumEncounters, subArraySize, playerNum);
    }
    return allPlayersData;
}

const BucketColors = [
    "#DA4453",
    "#ED5565",
    "#FC6E51",
    "#FFCE54",
    "#A0D468",
    "#D3D3D3"
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
    var tooltipText = "";
    
    if ($(cellId).attr("achievementText") !== undefined) {
        tooltipText += $(cellId).attr("achievementText") + "\n";
    }

    for (var i = 0; i < playersWhoHaveAchieve.length; i++) {
        tooltipText += playersWhoHaveAchieve[i] + "\n";
    }
    $(cellId).attr("title", tooltipText);
}

function populateTable(numCols, parentElementId, inputData, numRows, cols) {
    var numPlayers = inputData.length;
    var perEncounterArrays = splitCombinedEncounterDataForAllPlayers(inputData, numCols);

    for (var row = 0; row < numRows; row++) {
        for (var col = 1; col <= numCols; col++) {
            let cellId = "#" + parentElementId + cols[col] + row;
            if ($(cellId).attr("achievementText") == "n/a") {
                setCellColorBasedOnPercentComplete(cellId, -1);
            }
            else {
                var totalCountForCell = 0;
                var playersWhoHaveAchieve = [];
                for (var p = 0; p < numPlayers; p++) {
                    let val = parseInt(perEncounterArrays[p].achievements[row][col - 1])
                    totalCountForCell += val;
                    if (val == 1) {
                        playersWhoHaveAchieve.push(perEncounterArrays[p].name);
                    }
                }
                let percent = Math.trunc((totalCountForCell / numPlayers) * 100);
                $(cellId).html(totalCountForCell + "/" + numPlayers);
                setListOfPlayersWithAchieveInTooltip(cellId, playersWhoHaveAchieve);
                setCellColorBasedOnPercentComplete(cellId, percent);
            }
        }
    }
}

function populateDlcDungeonsFromData(inputData) {
    var numCols = 7;
    var parentElementId = "dlcDungeonsTableBody";
    var numRows = DlcDungeonData.length;
    var cols = DlcDungeonCols;

    populateTable(numCols, parentElementId, inputData, numRows, cols);
}

function populateBaseDungeonsFromData(inputData) {
    var numCols = 4;
    var parentElementId = "baseDungeonsTableBody";
    var numRows = BaseDungeonData.length;
    var cols = BaseDungeonCols;

    populateTable(numCols, parentElementId, inputData, numRows, cols);
}

function populateTrialssFromData(inputData) {
    var numCols = 6;
    var parentElementId = "trialsTableBody";
    var numRows = TrialData.length;
    var cols = TrialCols;

    populateTable(numCols, parentElementId, inputData, numRows, cols);
}


$(document).ready(function() {
    $("input[name$='options']").click(function() {
        var test = $(this).val();

        $("button.desc").hide();
        $("#val_" + test).show();

        $("#inputsContainer").show();
        $("#viewsContainer").hide();

        var isTrial = (test == 'Trials');
        for (var i = 4; i < 12; i++) {
            isTrial ? $("#dataInput" + i).show() : $("#dataInput" + i).hide();
        }
    });

    $("button[name$='generateViewButtons']").click(function() {
        var inputData = gatherInputData();
        if (inputData.length == 0) {
            window.alert("Please input valid data for at least one user");
            return;
        }

        var v = $(this).val();

        $("div.view").hide();
        $("button.desc").hide();
        $("#inputsContainer").hide();
        $("#viewsContainer").show();

        if (v == "dlcDungeons") {
            populateDlcDungeonsFromData(inputData);
        } else if (v == "baseDungeons") {
            populateBaseDungeonsFromData(inputData);
        } else if (v == "trials") {
            populateTrialssFromData(inputData);
        }

        $("#" + v + "View").show();
    });

    buildViews();
});
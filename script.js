
const DlcDungeonCols = ["name", "vet", "hm", "sr", "nd", "cha", "tri", "ext"];
const DlcDungeonData = [
    {NAME:"White Gold Tower",     TRINAME: null,                        EXTNAME: "Out of the Frying Pan", },
    {NAME:"Imperial City Prison", TRINAME: null,                        EXTNAME: "Out of Sight",          },
    {NAME:"Ruins of Mazzatun",    TRINAME: null,                        EXTNAME: "Obedience Training",    },
    {NAME:"Cradle of Shadows",    TRINAME: null,                        EXTNAME: "Embrace the Shadow",    },
    {NAME:"Falkreath Hold",       TRINAME: null,                        EXTNAME: "Epic Undertaking",      },
    {NAME:"Bloodroot Forge",      TRINAME: null,                        EXTNAME: "Wildlife Sanctuary",    },
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
    {NAME:"Hel Ra Citadel",         PHM1NAME:"",         PHM2NAME:"",        HMNAME:"Celest. Warrior", TRINAME:"",                    EXTNAME:""                     },
    {NAME:"Aetherian Archive",      PHM1NAME:"",         PHM2NAME:"",        HMNAME:"Celest. Mage",    TRINAME:"",                    EXTNAME:""                     },
    {NAME:"Sanctum Ophidia",        PHM1NAME:"",         PHM2NAME:"",        HMNAME:"Celest. Serpent", TRINAME:"",                    EXTNAME:""                     },
    {NAME:"Maw of Lorkhaj",         PHM1NAME:"",         PHM2NAME:"",        HMNAME:"Rakkhat",         TRINAME:"",                    EXTNAME:"Dro-m'Athra Destroyer"},
    {NAME:"Halls of Fabrication",   PHM1NAME:"",         PHM2NAME:"",        HMNAME:"Assembly Gen.",   TRINAME:"Tick-Tock Tormentor", EXTNAME:"The Dynamo"           },
    {NAME:"Asylum Sanctorium",      PHM1NAME:"+Llothis", PHM2NAME:"+Felms",  HMNAME:"vAS +2",          TRINAME:"Saintly Savior",      EXTNAME:"Immortal Redeemer"    },
    {NAME:"Cloudrest",              PHM1NAME:"vCR +1",   PHM2NAME:"vCR +2",  HMNAME:"vCR +3",          TRINAME:"Gryphon Heart",       EXTNAME:"Welkynar Liberator"   },
    {NAME:"Sunspire",               PHM1NAME:"Yolna",    PHM2NAME:"Lokke",   HMNAME:"Nahvi",           TRINAME:"Godslayer",           EXTNAME:"Hand of Alkosh"       },
    {NAME:"Kyne's Aegis",           PHM1NAME:"Yandir",   PHM2NAME:"Vrol",    HMNAME:"Falgravn",        TRINAME:"Kyne's Wrath",        EXTNAME:"Dawnbringer"          },
    {NAME:"Rockgrove",              PHM1NAME:"Oaxiltso", PHM2NAME:"Bahsei",  HMNAME:"Xalvakka",        TRINAME:"Planesbreaker",       EXTNAME:"Daedric Bane"         },
    {NAME:"Dreadsail Reef",         PHM1NAME:"Twins",    PHM2NAME:"Reef",    HMNAME:"Taleria",         TRINAME:"Soul of the Squall",  EXTNAME:"Swashbuckler Supreme" }
];

function createTableRow(num, dataRow, cols, parentElementId) {
    var row = document.createElement("tr");
    cols.forEach((c) => {
        var cell = document.createElement("td");
        cell.id = parentElementId + c + num;
        if (c == "name") {
            cell.setAttribute("scope", "row");
            cell.textContent = dataRow.NAME;
        }
        if (c == "tri" && dataRow.TRINAME != null) {
            cell.textContent = dataRow.TRINAME;
        }
        if (c == "ext" && dataRow.EXTNAME != null) {
            cell.textContent = dataRow.EXTNAME;
        }
        if (c == "phm1" && dataRow.PHM1NAME != null) {
            cell.textContent = dataRow.PHM1NAME;
        }
        if (c == "phm2" && dataRow.PHM2NAME != null) {
            cell.textContent = dataRow.PHM2NAME;
        }
        if (c == "hm" && dataRow.HMNAME != null) {
            cell.textContent = dataRow.HMNAME;
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

    if (!validInputSizes.includes(input.length)) {
        return false;
    }

    for (var i = 0; i < input.length; i++) {
        if (!isValidCharacter(input[i])) {
            return false;
        }
    }

    return true;
}

function validateGatheredData(allData) {
    var allOk = true;
    for (var i = 0; i < allData.length; i++) {
        allOk = allOk && allData[0].length == allData[i].length;
    }
    return allOk;
}

function gatherInputData() {
    var data = []
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

function splitCombinedEncounterDataForAllPlayers(fullArray, subArraySize) {
    var fullResult = new Array();
    for (var playerNum = 0; playerNum < fullArray.length; playerNum++) {
        var numSubArrays = fullArray[playerNum].length / subArraySize;
        fullResult[playerNum] = new Array();
        var fullArrayPointer = 0;
        for (var i = 0; i < numSubArrays; i++) {
            fullResult[playerNum][i] = new Array();
            for (var j = 0; j < subArraySize; j++) {
                fullResult[playerNum][i].push(fullArray[playerNum][fullArrayPointer]);
                fullArrayPointer++;
            }
        }
    }
    return fullResult;
}

function setCellColorBasedOnPercentComplete(cellId, percentValue) {
    $(cellId)
      // print the value
      .html(percentValue)
      // colorize the text, more red if it's close to 0
      // and more green as it approach 100
      .css({background: `rgb(${(100 - percentValue) *2.56}, ${percentValue *2.56},0)`})
  }

function populateTable(numCols, parentElementId, inputData, numRows, cols) {
    var numPlayers = inputData.length;
    var perEncounterArrays = splitCombinedEncounterDataForAllPlayers(inputData, numCols);

    for (var row = 0; row < numRows; row++) {
        for (var col = 1; col <= numCols; col++) {
            var totalCountForCell = 0;
            for (var p = 0; p < numPlayers; p++) {
                totalCountForCell += parseInt(perEncounterArrays[p][row][col - 1]);
            }
            let cellId = "#" + parentElementId + cols[col] + row;
            let percent = Math.trunc((totalCountForCell / numPlayers) * 100);
            setCellColorBasedOnPercentComplete(cellId, percent);
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
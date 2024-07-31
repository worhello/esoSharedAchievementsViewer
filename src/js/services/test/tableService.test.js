"use strict";

import { getData } from '../../data/schemas.js';
import { getValidInputSizeForType } from '../inputCodesService.js'
import { Player } from '../../model/player.js';
import { buildTableModel } from '../tableService.js';

import * as assert from 'assert';

const schemaVersion = 5;

describe('TableService.buildTableModel', function () {
  const schemaData = getData(schemaVersion, 'dungeon');

  describe('players with different sets of achievements', function() {
    const players = buildPlayersArray([2, 3]);
    const model = buildTableModel(schemaData, players);
    it('ensure state is correct', function () {
      assert.equal(model.headerText, 'Player 1, Player 2', 'should have a headerText with both player names');
      assert.equal(model.achievementsList[0].completedPercent, 100.0, "the 1st achievement has 100% completion rate");
      assert.equal(model.achievementsList[1].completedPercent, 0.0, "the 2nd achievement has 0% completion rate");
      assert.equal(model.achievementsList[2].completedPercent, 50.0, "the 3rd achievement has 50% completion rate");
      assert.equal(model.achievementsList[3].completedPercent, 50.0, "the 4th achievement has 50% completion rate");
      assert.equal(model.achievementsList[4].completedPercent, -1, "the 5th achievement has a negative completion rate as it is not an achievement");
      assert.equal(model.achievementsList[5].completedPercent, -1, "the 6th achievement has a negative completion rate as it is not an achievement");
      assert.equal(model.achievementsList[0].isAchievement, true, "the 1st achievement is an achievement");
      assert.equal(model.achievementsList[1].isAchievement, true, "the 2nd achievement is an achievement");
      assert.equal(model.achievementsList[2].isAchievement, true, "the 3rd achievement is an achievement");
      assert.equal(model.achievementsList[3].isAchievement, true, "the 4th achievement is an achievement");
      assert.equal(model.achievementsList[4].isAchievement, false, "the 5th achievement is not an achievement");
      assert.equal(model.achievementsList[5].isAchievement, false, "the 6th achievement is not an achievement");

      assertSamePlayersHaveAchievement(model.achievementsList[0].playersWhoHaveAchieve, ['Player 1', 'Player 2']);
      assertSamePlayersHaveAchievement(model.achievementsList[1].playersWhoHaveAchieve, []);
      assertSamePlayersHaveAchievement(model.achievementsList[2].playersWhoHaveAchieve, ['Player 1']);
      assertSamePlayersHaveAchievement(model.achievementsList[3].playersWhoHaveAchieve, ['Player 2']);
      assertSamePlayersHaveAchievement(model.achievementsList[4].playersWhoHaveAchieve, []);
      assertSamePlayersHaveAchievement(model.achievementsList[5].playersWhoHaveAchieve, []);
    });
  });

  describe('players with the same sets of achievements', function() {
    const players = buildPlayersArray([2, 2]);
    const model = buildTableModel(schemaData, players);
    it('ensure state is correct', function () {
      assert.equal(model.achievementsList[0].completedPercent, 100.0, "should return a model where the 1st achievement has 100% completion rate");
      assert.equal(model.achievementsList[1].completedPercent, 0.0, "should return a model where the 2nd achievement has 100% completion rate");
      assert.equal(model.achievementsList[2].completedPercent, 100.0, "should return a model where the 3rd achievement has 100% completion rate");

      assertSamePlayersHaveAchievement(model.achievementsList[0].playersWhoHaveAchieve, ['Player 1', 'Player 2']);
      assertSamePlayersHaveAchievement(model.achievementsList[1].playersWhoHaveAchieve, []);
      assertSamePlayersHaveAchievement(model.achievementsList[2].playersWhoHaveAchieve, ['Player 1', 'Player 2']);
    });
  });

});

function buildPlayersArray(playerBitMods) {
  const numBits = getValidInputSizeForType(schemaVersion, 'dlcDungeons');

  const players = [];

  // only build binary strings for test purposes
  for (let i = 1; i <= playerBitMods.length; i++) {
    players.push(buildPlayer(i, schemaVersion, numBits, playerBitMods[i - 1]));
  }

  return players;
}

function buildPlayer(playerNum, schemaVersion, numBits, bitModulo) {
  const player = new Player();
  player.name = "Player " + playerNum;
  player.schemaVersion = schemaVersion;

  const binary = buildBinaryDataForTest(numBits, bitModulo);
  player.originalInput = binary;
  player.binaryCode = binary;

  return player;
}

function buildBinaryDataForTest(numBits, bitModulo) {
  let binary = "";
  for (let i = 0; i < numBits; i++) {
    binary += (i % bitModulo == 0) ? "1" : "0";
  }
  return binary;
}

function assertSamePlayersHaveAchievement(actualPlayersWhoHaveAchieve, expectedPlayerNamessWhoHaveAchieve) {
  const actualPlayerNamessWhoHaveAchieve = actualPlayersWhoHaveAchieve.filter(p => p.hasAchieve).map(p => p.name).sort();

  assert.equal(actualPlayerNamessWhoHaveAchieve.length, expectedPlayerNamessWhoHaveAchieve.length);
  for (let i = 0; i < actualPlayerNamessWhoHaveAchieve.length; i++) {
    assert.equal(actualPlayerNamessWhoHaveAchieve[i], expectedPlayerNamessWhoHaveAchieve[i]);
  }
}
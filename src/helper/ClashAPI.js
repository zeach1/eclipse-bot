'use strict';

const { api_token, clanTag } = require('../config/config.js');
const clash = require('clash-of-clans-api');
const Messenger = require('./Messenger.js');

const client = clash({ token: api_token });

function getCurrentWar(tag) {
  return client.clanCurrentWarByTag(tag ? tag : clanTag).catch(e => e);
}

function getPlayer(tag) {
  return client.playerByTag(tag).catch(console.error);
}

class ClashAPI {
  static async getLineup(message, tag) {
    const war = await getCurrentWar(tag).catch(console.error);

    // access issues
    if (war.error) {
      Messenger.sendMaintenanceError(message, war.error);
      return null;
    }

    // no war happening
    if (war.state === 'warEnded' || war.state === 'notInWar') return [];

    return war.clan.members;
  }

  static getPlayerData(message, tag) {
    return getPlayer(tag);
  }
}

module.exports = ClashAPI;

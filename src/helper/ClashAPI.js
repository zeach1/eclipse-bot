'use strict';

const { api_token, clanTag } = require('../config/config.js');
const clash = require('clash-of-clans-api');

const client = clash({ token: api_token });

function getCurrentWar(tag) {
  return client.clanCurrentWarByTag(tag ? tag : clanTag).catch(console.error);
}

function getPlayer(tag) {
  if (!tag) throw new Error('No tag specified!');

  return client.playerByTag(tag).catch(console.error);
}

class ClashAPI {
  static async getLineup(tag) {
    const war = await getCurrentWar(tag).catch(console.error);
    if (!war || war.state === 'warEnded') return [];

    return war.clan.members;
  }

  static getPlayerData(tag) {
    return getPlayer(tag);
  }
}

module.exports = ClashAPI;

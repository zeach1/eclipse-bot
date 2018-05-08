'use strict';

const { api_token, clanTag } = require('../config/config.js');
const clash = require('clash-of-clans-api');

const client = clash({ token: api_token });

function getCurrentWar(tag) {
  return client.clanCurrentWarByTag(tag ? tag : clanTag).catch(console.error);
}

class ClashAPI {
  static async getLineup(tag) {
    const war = await getCurrentWar(tag).catch(console.error);
    if (!war || war.state === 'warEnded') return [];

    return war.clan.members;
  }
}

module.exports = ClashAPI;

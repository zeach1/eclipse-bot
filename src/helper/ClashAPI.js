'use strict';

const { api_token, clanTag } = require('../config/config.js');
const clash = require('clash-of-clans-api');

const client = clash({ token: api_token });

async function getClan(tag) {
  let clan;
  await client.clanByTag(tag ? tag : clanTag)
    .then(r => { clan = r; })
    .catch(console.error);

  return clan;
}

async function getCurrentWar(tag) {
  let war;
  await client.clanCurrentWarByTag(tag ? tag : clanTag)
    .then(r => { war = r; })
    .catch(console.error);

  return war;
}

class ClashAPI {
  static async getLineup(tag) {
    const war = await getCurrentWar(tag).catch(console.error);
    if (!war) return null;

    return war.clan.members;
  }
}

module.exports = ClashAPI;

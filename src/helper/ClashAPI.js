const { api_token, clanTag } = require('../config/config.js');
const clash = require('clash-of-clans-api');
const Messenger = require('./Messenger.js');

const client = clash({ token: api_token });

function getPlayer(tag) {
  return client.playerByTag(tag).catch(e => e);
}

function getClan(tag) {
  return client.clanByTag(tag ? tag : clanTag).catch(e => e);
}

function getCurrentWar(tag) {
  return client.clanCurrentWarByTag(tag ? tag : clanTag).catch(e => e);
}

function handleAccessError(message, war) {
  Messenger.sendMaintenanceError(message, war.error);
  return null;
}

class ClashAPI {
  static async getClanMembers(message, tag) {
    const clan = await getClan(tag);

    // API login issues
    if (clan.error) return handleAccessError(message, clan);

    let members = [];
    for (const member of clan.memberList) {
      // the following will not have an API login error, as the above should catch any possible error
      members.push(getPlayer(member.tag));
    }

    // returns all clan members with regular player data, not clan player data (see developer.clashofclans.com for more info)
    await Promise.all(members)
      .then(complete => { members = complete; })
      .catch(console.error);

    return members;
  }

  static async getLineup(message, tag) {
    const war = await getCurrentWar(tag).catch(console.error);

    // API login issues
    if (war.error) return handleAccessError(message, war);

    // no war happening
    if (war.state === 'warEnded' || war.state === 'notInWar') return [];

    return war.clan.members;
  }
}

module.exports = ClashAPI;

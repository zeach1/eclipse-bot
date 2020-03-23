const clash = require('clash-of-clans-api');
const { api_token: apiToken, clanTag } = require('../config/config.js');
const Messenger = require('./Messenger.js');

const client = clash({ token: apiToken });

function getPlayer(tag) {
  return client.playerByTag(tag).catch((e) => e);
}

function getClan(tag) {
  return client.clanByTag(tag || clanTag).catch((e) => e);
}

function getCurrentWar(tag) {
  return client.clanCurrentWarByTag(tag || clanTag).catch((e) => e);
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
    clan.memberList.forEach((member) => {
      // the following will not have an API login error, as the above should catch any possible
      // error
      members.push(getPlayer(member.tag));
    });

    // returns all clan members with regular player data, not clan player data (see
    // developer.clashofclans.com for more info)
    await Promise.all(members)
      .then((complete) => { members = complete; })
      .catch((e) => Messenger.sendDeveloperError(message, e));

    return members;
  }

  static async getLineup(message, tag) {
    const war = await getCurrentWar(tag).catch((e) => Messenger.sendDeveloperError(message, e));

    // API login issues
    if (war.error) return handleAccessError(message, war);

    // no war happening
    if (war.state === 'warEnded' || war.state === 'notInWar') return [];

    return war.clan.members;
  }
}

module.exports = ClashAPI;

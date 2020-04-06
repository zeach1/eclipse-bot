const ClashAPI = require('./ClashAPI.js');
const { role: roleConfig } = require('../config/config.js');
const multiAccounts = require('../config/accounts.js');
const Messenger = require('./Messenger.js');
const Util = require('./Util.js');

const DISCORD_COOLDDOWN = 3000;

let working = false;

function getRole(message, role) {
  return role.id ? role : message.guild.roles.get(role);
}

class Member {
  static findRole(message, role) {
    return getRole(message, role);
  }

  static matchAccount(message, members, name) {
    const matchedAccount = multiAccounts.indexOf((account) => account.alias.includes(name));
    return matchedAccount !== -1
      ? Member.findMemberByName(message, members, matchedAccount.main)
      : null;
  }

  static addScoreToMembers(message, members) {
    const newMembers = { ...members };

    members.forEach((member) => {
      const score = message.client.points.get(member.id);
      if (score) {
        newMembers[member.id].exp = score.exp;
        newMembers[member.id].ranking = score.ranking;
        newMembers[member.id].flair = score.flair;
      }
    });

    return newMembers;
  }

  // should include flair on object returned
  static findMemberByName(message, members, name) {
    // search algorithm: put member names from shortest to longest
    const sortedMembers = Util.sort(members, true, true);

    let m = sortedMembers.find((member) => Util.match(
      name.split(' ')[0],
      member.displayName,
      true,
      true,
    ));
    if (!m) {
      return null;
    }

    [m] = Member.addScoreToMembers(message, [m]);

    return m;
  }

  // should include flair on object returned
  static getMembersByRole(message, role) {
    let allMembers = [];
    const roleArray = Array.isArray(role) ? role : [role];
    roleArray.forEach((r) => {
      const discordRole = getRole(message, r);
      discordRole.members.array().forEach((member) => {
        if (!allMembers.includes(member)) {
          allMembers.push(member);
        }
      });
    });

    allMembers = Util.sort(allMembers, true);
    allMembers = Member.addScoreToMembers(message, allMembers);
    return allMembers;
  }

  static listMembersWithRole(message, role) {
    if (working) return;

    const members = Member.getMembersByRole(message, role)
      .map((member) => `${member.displayName} ${member.flair ? member.flair : ''}`);

    Messenger.sendMessage(message, {
      title: `📝 List of members with role: ${getRole(message, role).name}`,
      color: 0xf5f513,
      description: members.length > 0 ? members.join('\n') : 'None',
    });
  }

  static async clearMembersOfRole(message, role) {
    const members = Member.getMembersByRole(message, role);
    let removed = await Member.removeRoleFromMembers(message, members, role)
      .catch((e) => Messenger.sendDeveloperError(message, e));
    removed = removed.map((member) => `${member.displayName}${member.flair ? member.flair : ''}`);

    Messenger.sendSuccessMessage(message, {
      title: `❎ Cleared all members from role: ${getRole(message, role).name}`,
      description: removed.length > 0 ? removed.join('\n') : 'None',
    });
  }

  // this is not where I should check if objects have flair or not
  static async addRoleToMembers(message, members, role) {
    if (working) return null;
    working = true;

    const discordRole = getRole(message, role);
    const adding = [];
    const complete = [];

    members.forEach(async (member) => {
      if (member && !member.roles.get(discordRole.id)) {
        complete.push(member.addRole(discordRole));

        if (!adding.includes(member.displayName)) {
          adding.push(member);
        }

        if (complete.length >= 5) {
          // prevent Discord from blocking promise processes from happening with this cooldown
          complete.push(new Promise((resolve) => { setTimeout(resolve, DISCORD_COOLDDOWN); }));
          await Promise.all(complete)
            .then(() => { complete.length = 0; })
            .catch((e) => Messenger.sendDeveloperError(message, e));
        }
      }
    });

    await Promise.all(complete).catch((e) => Messenger.sendDeveloperError(message, e));
    working = false;
    return adding;
  }

  // this is not where I should check if objects have flair or not
  static async removeRoleFromMembers(message, members, role) {
    if (working) return null;
    working = true;

    const discordRole = getRole(message, role);
    const removing = [];
    const complete = [];

    members.forEach(async (member) => {
      if (member && member.roles.get(discordRole.id)) {
        complete.push(member.removeRole(discordRole));

        if (!removing.includes(member.displayName)) {
          removing.push(member);
        }

        if (complete.length >= 5) {
          // prevent Discord from blocking promise processes from happening with this cooldown
          complete.push(new Promise((resolve) => { setTimeout(resolve, DISCORD_COOLDDOWN); }));
          await Promise.all(complete)
            .then(() => { complete.length = 0; })
            .catch((e) => Messenger.sendDeveloperError(message, e));
        }
      }
    });

    await Promise.all(complete).catch((e) => Messenger.sendDeveloperError(message, e));
    working = false;
    return removing;
  }

  static matchAccountsToMembers(message, accounts, members) {
    const matchedMembers = [];
    accounts.forEach((account) => {
      const member = Member.findMemberByName(message, members, account.name)
        || Member.matchAccount(message, members, account.name);

      if (!member) {
        return;
      }

      // this will create an property called "accounts" appended to the GuildMember data, which
      // contains any COC account info
      // this info depends on the data that is taken in by ClashAPI, as war player data !== normal
      // player data
      if (matchedMembers.includes(member)) {
        matchedMembers.find((m) => m.id === member.id).accounts.push(account);
      } else {
        member.accounts = [account];
        matchedMembers.push(member);
      }
    });

    return matchedMembers;
  }

  // this is when I want to match all members instead of a certain range
  // members will have Eclipse role
  static async matchAllClanAccountsToAllMembers(message) {
    working = true;

    const accounts = await ClashAPI.getClanMembers(message);

    // API login issues
    if (!accounts) {
      working = false;
      return null;
    }

    let members = Member.getMembersByRole(message, [roleConfig.eclipse, roleConfig.war_guest]);

    members = Member.matchAccountsToMembers(message, accounts, members);

    working = false;
    return members;
  }

  static fix() { working = false; }
}

module.exports = Member;

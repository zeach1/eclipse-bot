'use strict';

const Check = require('../helper/Check.js');
const ClashAPI = require('../helper/ClashAPI.js');
const Member = require('../helper/Member.js');
const Messenger = require('../helper/Messenger.js');
const outdent = require('outdent');
const Util = require('../helper/Util.js');

const inwar = 'in war';
const elegible = ['50v50', 'Eclipse', inwar];
const mini = [
  {
    main: 'jwoelmer2',
    mini: ['DRAGON BABY'],
  },
  {
    main: 'Simon',
    mini: ['Gee Gee', 'White Beard'],
  },
  {
    main: 'rickgrimes',
    mini: ['carlgrimes'],
  },
  {
    main: 'danny',
    mini: ['Mister'],
  },
  {
    main: 'Darren',
    mini: ['tonto'],
  },
  {
    main: 'DEEZ NUTZ',
    mini: ['XtrashgamerguyX'],
  },
  {
    main: 'PERIL',
    mini: ['@k$#@¥', 'PERICULUM', 'Perilcakes', 'Twice', 'White Walker', 'zeach'],
  },
];

function getWarElegible(message) {
  const warElegible = [];
  for (const eleg of elegible) {
    for (const member of Member.getMembersByRole(message, eleg)) {
      warElegible.push(member);
    }
  }
  return warElegible;
}

// will include flair in object returned
function getMembers(message, names) {
  const members = [];
  for (const member of message.mentions.members.array()) {
    members.push(Member.addScoreToMembers(message, [member])[0]);
  }

  const warElegible = getWarElegible(message);
  for (const name of names.filter(n => !n.startsWith('<'))) {
    members.push(Member.findMemberByName(message, warElegible, name));
  }

  return members;
}

function matchMiniAccounts(message, warElegible, name) {
  for (const account of mini) {
    if (account.mini.includes(name)) {
      return Member.findMemberByName(message, warElegible, account.main);
    }
  }
  return null;
}

async function refresh(message) {
  // will have flair
  const warElegible = getWarElegible(message);

  // will have flair
  const current = Member.getMembersByRole(message, inwar);

  // will have flair
  let lineup = await ClashAPI.getLineup(message).catch(console.error);

  // access issues
  if (!lineup) return;

  for (let i = 0; i < lineup.length; i++) {
    const member = Member.findMemberByName(message, warElegible, lineup[i].name) || matchMiniAccounts(message, warElegible, lineup[i].name);
    if (lineup.includes(member)) {
      lineup.splice(i, 1);
      i--;
    } else {
      lineup[i] = member;
    }
  }
  lineup = Util.sort(lineup.filter(m => m), true);

  const adding = [];
  const removing = [];

  for (const member of lineup) {
    // any member in lineup not in current will be added
    if (!current.includes(member)) {
      adding.push(member);
    }
  }

  for (const member of current) {
    // any member in current not in lineup will be removed
    if (!lineup.includes(member)) {
      removing.push(member);
    }
  }

  await Member.addRoleToMembers(message, adding, inwar).catch(console.error);
  await Member.removeRoleFromMembers(message, removing, inwar).catch(console.error);

  Messenger.sendMessage(message, {
    title: '✅ Lineup refreshed from in-game',
    color: 0x157676,
    description: outdent`
      ${outdent}
      **Added**
      ${adding.length > 0 ? adding.map(m => `${m.displayName} ${m.flair ? m.flair : ''}`).join('\n') : 'None'}

      **Removed**
      ${removing.length > 0 ? removing.map(m => `${m.displayName} ${m.flair ? m.flair : ''}`).join('\n') : 'None'}

      **Current lineup**
      ${lineup.length > 0 ? lineup.map(m => `${m.displayName} ${m.flair ? m.flair : ''}`).join('\n') : 'None'}
    `,
  });
}

async function addRoles(message) {
  // will have flair
  const members = getMembers(message, message.args.slice(1));
  let added = await Member.addRoleToMembers(message, members, inwar).catch(console.error);
  added = added.map(m => `${m.displayName} ${m.flair ? m.flair : ''}`);

  Messenger.sendMessage(message, {
    title: `✅ Added members to role: ${inwar}`,
    color: 0x157676,
    description: added.length > 0 ? added.join('\n') : 'None',
  });
}

async function removeRoles(message) {
  // will have flair
  const members = getMembers(message, message.args.slice(1));
  let removed = await Member.removeRoleFromMembers(message, members, inwar).catch(console.error);
  removed = removed.map(m => `${m.displayName} ${m.flair ? m.flair : ''}`);

  Messenger.sendMessage(message, {
    title: `❎ Removed members from role: ${inwar}`,
    color: 0x157676,
    description: removed.length > 0 ? removed.join('\n') : 'None',
  });
}

class Command {
  constructor() {
    this.name = 'inwar';

    this.args = 1;
    this.description = 'Manage members in war';
    this.type = 'essentials';
    this.usage = '<list | refresh | add/remove <members> | clear>';
  }

  execute(message) {
    switch (message.args[0]) {
      case 'add': case 'remove': case 'clear':
        if (!Check.hasPermissions(message.member, { type: 'leadership' })) {
          Messenger.sendPermissionError(message);
          return;
        }
    }

    switch (message.args[0]) {
      case 'list': Member.listMembersWithRole(message, inwar); break;
      case 'add': addRoles(message).catch(console.error); break;
      case 'remove': removeRoles(message).catch(console.error); break;
      case 'refresh': refresh(message).catch(console.error); break;
      case 'clear': Member.clearMembersOfRole(message, inwar).catch(console.error); break;
      default: Messenger.sendArgumentError(message, this, 'This argument does not exist');
    }
  }
}

module.exports = new Command();

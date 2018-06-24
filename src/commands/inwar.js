const Check = require('../helper/Check.js');
const ClashAPI = require('../helper/ClashAPI.js');
const Member = require('../helper/Member.js');
const Messenger = require('../helper/Messenger.js');
const outdent = require('outdent');

const inwar = 'in war';
const elegible = ['50v50', 'Eclipse', inwar];

// will include flair in object returned
function getMembers(message, names) {
  const members = [];
  for (const member of message.mentions.members.array()) {
    members.push(Member.addScoreToMembers(message, [member])[0]);
  }

  const warElegible = Member.getMembersByRole(message, inwar);
  for (const name of names.filter(n => !n.startsWith('<'))) {
    members.push(Member.findMemberByName(message, warElegible, name));
  }

  return members;
}

async function refresh(message) {
  // will have flair
  const warElegible = Member.getMembersByRole(message, elegible);

  // will have flair
  const current = Member.getMembersByRole(message, inwar);

  // in-game account details
  let lineup = await ClashAPI.getLineup(message).catch(console.error);

  // API login issues
  if (!lineup) return;

  // will have flair
  lineup = Member.matchAccountsToMembers(message, lineup, warElegible);

  // keep naming consistent with addRoles() and removeRoles()
  let added = [];
  let removed = [];

  for (const member of lineup) {
    // any member in lineup not in current will be added
    if (!current.includes(member)) {
      added.push(member);
    }
  }

  for (const member of current) {
    // any member in current not in lineup will be removed
    if (!lineup.includes(member)) {
      removed.push(member);
    }
  }

  added = await Member.addRoleToMembers(message, added, inwar).catch(console.error);
  removed = await Member.removeRoleFromMembers(message, removed, inwar).catch(console.error);

  // means that Member is working
  if (!added && !removed) return;

  added = added.map(m => `${m.displayName} ${m.flair ? m.flair : ''}`);
  removed = removed.map(m => `${m.displayName} ${m.flair ? m.flair : ''}`);
  lineup = lineup.map(m => `${m.displayName} ${m.flair ? m.flair : ''}`);

  Messenger.sendMessage(message, {
    title: '✅ Lineup refreshed from in-game',
    color: 0x157676,
    description: outdent`
      ${outdent}
      **Added**
      ${added.length > 0 ? added.join('\n') : 'None'}

      **Removed**
      ${removed.length > 0 ? removed.join('\n') : 'None'}

      **Current lineup**
      ${lineup.length > 0 ? lineup.join('\n') : 'None'}
    `,
  });
}

async function addRoles(message) {
  // will have flair
  const members = getMembers(message, message.args.slice(1));
  let added = await Member.addRoleToMembers(message, members, inwar).catch(console.error);

  // means that Member is working
  if (!added) return;

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

  // means that Member is working
  if (!removed) return;

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
      case 'add': {
        if (message.args.length < 2) {
          Messenger.sendArgumentError(message, this, 'You must specify at least one member');
          break;
        }
        addRoles(message).catch(console.error);
        break;
      }
      case 'remove': {
        if (message.args.length < 2) {
          Messenger.sendArgumentError(message, this, 'You must specify at least one member');
          break;
        }
        removeRoles(message).catch(console.error);
        break;
      }
      case 'refresh': refresh(message).catch(console.error); break;
      case 'clear': Member.clearMembersOfRole(message, inwar).catch(console.error); break;
      default: Messenger.sendArgumentError(message, this, 'This argument does not exist');
    }
  }
}

module.exports = new Command();

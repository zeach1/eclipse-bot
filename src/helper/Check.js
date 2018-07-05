const { role, user } = require('../config/config.js');

function verifyLeadership(member) {
  return verifyEclipse(member) && member.roles.get(role.leadership);
}

function verifyDeveloper(member) {
  return member.id === user.paul;
}

function verifyEclipse(member) {
  return member && member.roles.get(role.eclipse);
}

function verifyFriends(member) {
  return member && member.roles.get(role.friends);
}

class Check {
  static hasPermissions(member, command) {
    return command.type ? command.type === 'essentials' ||
           command.type === 'misc' ||
           (command.type === 'leadership' && verifyLeadership(member)) ||
           (command.type === 'developer' && verifyDeveloper(member)) : true;
  }

  static isDeveloper(member) {
    return verifyDeveloper(member);
  }

  static isLeadership(member) {
    return verifyLeadership(member);
  }

  static isEclipse(member) {
    return verifyEclipse(member);
  }

  static isFriends(member) {
    return verifyFriends(member);
  }

  static isMember(member) {
    return verifyEclipse(member) || verifyFriends(member);
  }

  static verifyArgument(args, command) {
    return args.length >= command.args;
  }

  static verifyTag(numTagged, command) {
    return numTagged >= command.tag;
  }
}

module.exports = Check;

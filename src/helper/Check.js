'use strict';

function verifyLeadership(member) {
  return verifyEclipse(member) && member.roles.some(r => r.name === 'Leadership');
}

function verifyDeveloper(member) {
  return verifyEclipse(member) && member.roles.some(r => r.name === 'Bot Developer');
}

function verifyEclipse(member) {
  return member && member.roles.some(r => r.name === 'Eclipse');
}

function verifyFriends(member) {
  return member && member.roles.some(r => r.name === 'Friends of Eclipse');
}

class Check {
  static hasPermissions(member, command) {
    return command.type === 'essentials' ||
           command.type === 'misc' ||
           (command.type === 'leadership' && verifyLeadership(member)) ||
           (command.type === 'developer' && verifyDeveloper(member));
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

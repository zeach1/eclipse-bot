const { prefix } = require('../config.json');
const { leadershipRoles } = require('../parameters.json');
const outdent = require('outdent');

module.exports = {
   verifyLeadership: function(message) {
      if (!message.member.roles.some(role => leadershipRoles.includes(role.name))) {
         message.channel.send('You do not have permission to use this command.');
         return false;
      }
      return true;
   },

   verifyTag: function(message, command) {
      if (message.mentions.users.size < command.tag) {
         message.channel.send(outdent({ 'trimLeadingNewline': true })`
            You need to tag ${command.tag > 1 ? `${command.tag}  users` : 'a user'}.
            The proper usage is: \`${prefix}${command.name}${command.usage ? ` ${command.usage}` : ' '}\``
         );
         return false;
      }
      return true;
   },

   verifyArgument: function(message, command, args) {
      if (args.length != command.args.length) {
         message.channel.send(outdent({ 'trimLeadingNewline': true })`
            You need to provide proper arguments.
            The proper usage is: \`${prefix}${command.name} ${command.usage ? command.usage : ''}\``
         );
         return false;
      }
      return true;
   },

   verifyTagHuman: function(message, member) {
      if (member.bot) {
         message.channel.send('You cannot tag a bot for this command.');
         return false;
      }
      return true;
   },
};

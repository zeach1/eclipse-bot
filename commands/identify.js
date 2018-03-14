const verify = require ('../misc/verify.js');

module.exports = {
   name: 'identify',
   description: 'Tells a user to identify him/herself on WarMatch',
   aliases: ['i'],
   usage: '<user>',
   leadership: true,
   args: 1,
   tag: 1,
   execute(message, args) {
      const user = message.mentions.users.first();
      const member = message.mentions.members.first();

      if (!verify.verifyTagHuman(message, user))
         return;

      if (!args[1])
         message.channel.send(`${member.user}, register your account in WarMatch by going to <#275563260386869248> and typing \`!wm identify ${member.nickname}\``);
      else
         message.channel.send(`${member.user}, register your account in WarMatch by going to <#275563260386869248> and typing \`!wm identify ${args[1]}\``);

      message.delete();
   },
};

const verify = require ('../misc/verify.js');

module.exports = {
   name: 'identify',
   description: 'Tells a user to identify him/herself on WarMatch',
   usage: '<user> <player tag>',
   
   leadership: true,
   args: 2,
   tag: 1,
  
   execute(message, args) {
      const user = message.mentions.users.first();
      const member = message.mentions.members.first();

      if (!verify.verifyHuman(message, user)) {
         message.channel.send('You cannot ask a bot to identify itself.');
         return;
      }

      message.channel.send(`${member.user}, register your account in WarMatch by going to <#275563260386869248> and typing \`!wm identify ${args[1]}\``);

      message.delete();
   },
};

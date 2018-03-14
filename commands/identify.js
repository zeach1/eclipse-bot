module.exports = {
   name: 'identify',
   description: 'Tell a user to identify him/herself on WarMatch',
   execute(message, args) {
      if (!requireLeadershipRole(message) || !requireTagUsers(message))
         return;

      const taggedUser = client.channels.get(message.channel.id).members.get(message.mentions.users.first().id);
      if (!requireHumanUser(message, taggedUser))
         return;

      if (args.length === 1)
         message.channel.send(`${taggedUser.user}, register your account in WarMatch by going to <#275563260386869248> and typing -> \`\`!wm identify ${taggedUser.nickname}\`\``);
      else
         message.channel.send(`${taggedUser.user}, register your account in WarMatch by going to <#275563260386869248> and typing -> \`\`!wm identify ${args[1]}\`\``);

      message.delete();
   }
}

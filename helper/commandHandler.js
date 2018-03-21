const { prefix, filterWords } = require('../data/config.js');

const check = require('../misc/check.js');

const messenger = require('./messenger.js');
const pointManager = require('./pointManager.js');

module.exports = {
  handleMessage: function(message) {
    const { content, channel, author, guild, client } = message;

    /* Custom command to load ranks from Mee6 to Eclipse Bot */
    if (message.author.id === '159985870458322944') {
      let m = message.content.split('\n');
      
      if (m.length != 4) return;
      
      m[0] = m[0].slice(4, -4);
      
      console.log(m[0]);
      
      m[0] = message.guild.members.find(member => member.user.username === m[0]);
      
      if (!m[0]) {
        console.log('failed\n');
        return;
      }
        
      m[0] = m[0].id;
      m[3] = parseInt(m[3].slice(m[3].indexOf('('), m[3].indexOf(')')).slice(6));
      m.splice(1, 2);
      
      console.log(m);
      
      pointManager.setPoints(message, { id: m[0] }, { exp: m[1] });
      
      const { exp, level, ranking } = message.client.points.get(m[0]);
      return message.channel.send(`Set <@${m[0]}>'s exp to ${exp}, level ${level}, ${ranking} ER`);
    }
    
/*  setPoints: function(message, player, info) {
    const score = message.client.points.get(player.id) || { exp: 0, level: 0, ranking: 5000 };

    if (info.exp) {
      score.exp = info.exp;
      score.level = this.getLevel(info.exp);
    }

    if (info.ranking)
      score.ranking > 9999 ? 9999 : (score.ranking < 1 ? 1 : score.ranking);

    message.client.points.set(player.id, score);*/
    
    /* Deletes offensive language */
    if (filterWords.some(word => content.toLowerCase().includes(word))) {
      return message.delete()
        .then(() => {
          channel.send(`💢 Watch your language ${author}`)
            .then((msg) => msg.delete(2000))
            .catch(e => console.error(e));
        })
        .catch(e => console.error(e));
    }

    /* Ignores message from bots (except Mee6) and non-members, and direct messages */
    if (author.bot || !check.verifyMember(message) || !guild) return;

    /* Point monitoring for any message sent by user */
    pointManager.updatePoints(message);

    /* Ignores numbers, non-commands, bot messages, and direct messages */
    if (!isNaN(content.replace(/ /g, '')) || !content.startsWith(prefix)) return;

    /* Prepare command, arguments, and options */
    const args = content.toLowerCase().slice(prefix.length).trim().split(/ +/);
    const options = [];

    const commandName = args.shift();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    for (let i = 0; i < args.length; i++)
      if (args[i].length > 1 && args[i].startsWith('-') && isNaN(args[i]))
        options.push(args.splice(i--, 1).pop().slice(1));

    /* Verify general command format and permissions */
    if (!command) {
      messenger.sendCommandDoesNotExistError(message).catch(e => console.error(e));
      return;
    }

    if (command.type === 'leadership' && !check.verifyLeadership(message) ||
        command.type === 'developer' && !check.verifyDeveloper(message)) {
      messenger.sendPermissionError(message).catch(e => console.error(e));
      return;
    }

    if (command.args && !check.verifyArgument(args, command)) {
      messenger.sendArgumentError(message, command, `You must provide ${command.args == 1 ? 'an argument' : `${command.args} arguments`}`)
        .catch(e => console.error(e));
      return;
    }

    if (command.tag && !check.verifyTag(message.mentions.users, command)) {
      messenger.sendArgumentError(message, command, `You need to tag ${command.tag > 1 ? `${command.tag}  users` : 'a user'}`)
        .catch(e => console.error(e));
      return;
    }

    /* Execute command */
    command.execute(message, {
      args: args,
      options: options,
    }).catch(e => {
      console.error(e);
      messenger.sendDeveloperError(message).catch(f => console.error(f));
    });
  },
};

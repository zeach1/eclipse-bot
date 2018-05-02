'use strict';

const Messenger = require('../helper/Messenger.js');
const { user } = require('../data/config.js');

function summon(message, num) {
  if (num <= 0) return;

  console.log(num);
  if (message.author.id !== user.prototype) {
    message.channel.send('Nah you can\'t do this fam.').catch(console.error);
    return;
  }

  message.channel.send('Can I code `****` bro? <:think:426636057082331136>').catch(console.error);

  setTimeout(() => summon(message, num - 1), 2000);
}

function reference(message) {
  const peril = message.guild.members.get(user.peril);

  if (peril) {
    Messenger.send(message, {
      title: peril.displayName,
      avatar: peril.user.avatarURL,
      description: 'Proto can\'t code `****`',
      footer: 'Today at 1:12 PM',
      color: 0xcccccc,
    });
  } else {
    message.channel.send('```PERIL - Today at 1:12 PM\nProto can\'t code ****```');
  }
}

class Command {
  constructor() {
    this.name = 'proto';

    this.args = 1;
    this.description = 'Fun commands, Prototype style';
    this.type = 'misc';
    this.usage = '<quote | summon [number] | reference>';
  }

  execute(message) {
    switch (message.args[0]) {
      case 'quote': message.channel.send('`He can\'t code ****`').catch(console.error); break;
      case 'summon': {
        let num = parseInt(message.args[1]);
        num = !num ? 1 : num > 10 ? 10 : num;

        summon(message, num);
        break;
      }
      case 'reference': reference(message); break;
      default: Messenger.sendArgumentError(message, this); break;
    }
  }
}

module.exports = new Command();

import { Collection, Message } from 'discord.js';
import Enmap from 'enmap';

import commands from '../commands/index';
import { expCooldown, prefix, server } from '../config/index';
import Command from '../struct/command';
import Rank from '../struct/rank';

import { sendMessage } from './sendMessage';

const rankCooldown = new Collection();

function processCommand(message: Message): void {
  /*
   * Prepares the message by lowercasing it, removing the command prefix,
   * and trimming any excess whitespace.
   */
  const content = message.content.toLowerCase().slice(prefix.length).trim();

  // Gets args and commandName from processed content.
  const args = content.split(/ +/);
  const commandName = args.shift();

  // Runs corresponding command.
  const command: Command = commands[commandName];
  command.run(message, args).catch(() => {});
}

function processRank(message: Message, ranks: Enmap): void {
  // Exits if user is still in cooldown to getting more exp.
  if (rankCooldown.has(message.author.id)) return;

  // Adds user to cooldown collection for one minute.
  rankCooldown.set(message.author.id, message.author);
  setTimeout(() => rankCooldown.delete(message.author.id), expCooldown * 1000);

  // Updates user exp accordingly.
  let rank = ranks.get(message.author.id);
  if (!rank) {
    rank = new Rank();
  }

  // Persistent enmap will save ranks as JSON, so we have to turn the JSON back to Rank.
  if (!(rank instanceof Rank)) {
    rank = new Rank(rank);
  }

  const oldLevel = rank.getLevel();

  // Add exp to user rank.
  const addedExp = Math.floor(Math.random() * 6) + 10;
  rank.setExp(rank.getExp() + addedExp);

  const newLevel = rank.getLevel();

  if (newLevel > oldLevel) {
    sendMessage(message, {
      title: '🎉 Level Up',
      color: 0x3ea92e,
      description: `${message.author} has leveled up to level ${newLevel}!`,
    });
  }

  ranks.set(message.author.id, rank);
}

export function processMessage(message: Message, ranks: Enmap): void {
  // Ignores all messages outside of Reddit Eclipse server.
  if (message.guild.id !== server.guild) return;

  // Ignore all messages from bots.
  if (message.author.bot) return;

  processRank(message, ranks);

  // Processes message as a command if it is a command (and not a number).
  if (message.content.startsWith(prefix)) {
    processCommand(message);
  }
}

export default { processMessage };

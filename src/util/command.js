import fs from 'fs';
import minimist from 'minimist';
import shlex from 'shlex';

import { PREFIX } from '../config';
import * as logger from './logger';
import { sendRaw } from './messenger';

const DEVELOPMENT_TYPE = 'Development';
const ECLIPSE_TYPE = 'Eclipse';
const ESSENTIALS_TYPE = 'Essentials';
const LEADERSHIP_TYPE = 'Leadership';
const MISC_TYPE = 'Miscellaneous';

const COMMANDS_DIRECTORY = './src/commands';
const DEVELOPMENT_COMMANDS_DIRECTORY = `${COMMANDS_DIRECTORY}/development`;
const ECLIPSE_COMMANDS_DIRECTORY = `${COMMANDS_DIRECTORY}/eclipse`;
const ESSENTIALS_COMMANDS_DIRECTORY = `${COMMANDS_DIRECTORY}/essentials`;
const LEADERSHIP_COMMANDS_DIRECTORY = `${COMMANDS_DIRECTORY}/leadership`;
const MISC_COMMANDS_DIRECTORY = `${COMMANDS_DIRECTORY}/misc`;

/**
 * @callback CommandExecute
 * @param {!import('discord.js').Message} message
 * @param {!import('minimist').ParsedArgs} args
 * @returns {void}
 */

/**
 * @typedef Command
 * @type {object}
 * @property {!string} name Name of command, as well as main alias for command
 * @property {!string} description Brief description of command
 * @property {!string} type Type of command
 * @property {!number} args Number of arguments command should have when called
 * @property {!number} mentions Number of mentions command should have when called
 * @property {!CommandExecute} execute Function to execute on command
 * @property {!string} [details] Detailed descrioption of command
 * @property {!string} [usage] Usage of command, required if args > 0 or mentions > 0
 * @property {!string[]} [aliases] Different aliases of command that can be called
 */

/**
 * Mapping of command alias to command name.
 * @type {!Map<string, string>}
 */
const aliases = new Map();

/**
 * Mapping of command alias to command object
 * @type {!Map<string, Command>}
 */
const commands = new Map();

/**
 * Checks if a command has valid information. This includes mandatory information as well as no
 * duplicate names. Throws if command fails validation.
 * @param {!Command} command Command to check
 * @throws Will throw an error if command fails validotion.
 */
function validCommand(command) {
  // check type of command fields
  if (typeof command.name !== 'string') {
    logger.error('Received command with no name', command);
    return false;
  }
  if (typeof command.description !== 'string') {
    logger.error('Received command with no description', command);
    return false;
  }
  if (typeof command.type !== 'string') {
    logger.error('Received command with no type', command);
    return false;
  }
  if (typeof command.args !== 'number') {
    logger.error('Received command with no args', command);
    return false;
  }
  if (typeof command.mentions !== 'number') {
    logger.error('Received command with no mentions', command);
    return false;
  }
  if (typeof command.execute !== 'function') {
    logger.error('Received command with invalid execute function', command);
    return false;
  }
  if (command.details !== undefined && typeof command.details !== 'string') {
    logger.error('Received command with invalid details', command);
    return false;
  }
  if (command.usage !== undefined && typeof command.usage !== 'string') {
    logger.error('Received command with invalid usage', command);
    return false;
  }
  if (command.aliases !== undefined && !Array.isArray(command.aliases)) {
    logger.error('Received command with invalid aliases', command);
    return false;
  }

  // check required usage if args/mentions > 0
  if ((command.args > 0 || command.mentions > 0) && command.usage === undefined) {
    logger.error('Received command with required args/mentions but no usage', command);
    return false;
  }

  // check duplicate command name
  if (aliases.has(command.name)) {
    logger.error(`Received command "${command.name}" whose name exists in another command "${aliases.get(command.name)}"`);
    return false;
  }
  if (command.aliases !== undefined) {
    const duplicateAlias = command.aliases.some((alias) => {
      if (aliases.has(alias)) {
        logger.error(`Received command "${command.name}" whose alias "${alias}" exists in another command "${aliases.get(alias)}"`);
      }
      return aliases.has(alias);
    });

    if (duplicateAlias) {
      return false;
    }
  }

  return true;
}

/**
 * Adds all commands in a given directory and a given command type.
 *
 * @param {!string} type Command type
 * @param {!string} directory Path to directory
 */
function addCommandsInDirectory(type, directory) {
  fs.readdirSync(directory).forEach((file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const info = require(`../../${directory}/${file}`);

    /**
     * @type {Command}
     */
    const command = {
      ...info,
      type,
    };

    if (!validCommand(command)) {
      return;
    }

    aliases.set(command.name, command.name);
    if (command.alises !== undefined) {
      command.aliases.forEach((alias) => {
        aliases.set(alias, command.name);
      });
    }

    commands.set(command.name, command);
  });
}

/**
 * Goes through all available commands and sets them up.
 */
export function setUpCommands() {
  addCommandsInDirectory(DEVELOPMENT_TYPE, DEVELOPMENT_COMMANDS_DIRECTORY);
  addCommandsInDirectory(ECLIPSE_TYPE, ECLIPSE_COMMANDS_DIRECTORY);
  addCommandsInDirectory(ESSENTIALS_TYPE, ESSENTIALS_COMMANDS_DIRECTORY);
  addCommandsInDirectory(LEADERSHIP_TYPE, LEADERSHIP_COMMANDS_DIRECTORY);
  addCommandsInDirectory(MISC_TYPE, MISC_COMMANDS_DIRECTORY);
}

/**
 * Executes a command.
 * @param {import('discord.js').Message} message Message context
 */
export function executeCommand(message) {
  const [name, args] = message.content.slice(PREFIX.length).split(/(?<=^\S+)\s/);

  const commandName = aliases.get(name);
  if (commandName === undefined) {
    return;
  }

  const command = commands.get(commandName);
  if (command === undefined) {
    logger.error(`Found undefined command for command name "${commandName}"`);
    return;
  }

  // all args without any mentions in it
  const filteredArgs = shlex.split(args || '').filter((arg) => arg.match(/<@.*?>/) === null);

  const parsedArgs = minimist(filteredArgs);
  if (command.args !== undefined && parsedArgs._.length < command.args) {
    sendRaw(message, `Insufficient arguents given, required ${command.args} given ${filteredArgs.length}`);
    return;
  }
  if (command.mentions !== undefined && message.mentions.members < command.mentions) {
    sendRaw(message, `Insufficient mentions given, required ${command.mentions} given ${message.mentions.length}`);
    return;
  }

  command.execute(message, parsedArgs);
}

export default {
  setUpCommands,
  executeCommand,
};

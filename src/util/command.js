import fs from 'fs';
import path from 'path';

import logger, { toString } from './logger';

const DEVELOPMENT_TYPE = 'Development';
const ECLIPSE_TYPE = 'Eclipse';
const ESSENTIALS_TYPE = 'Essentials';
const LEADERSHIP_TYPE = 'Leadership';
const MISC_TYPE = 'Miscellaneous';

const COMMANDS_DIRECTORY = path.resolve(__dirname, '..', 'commands');
const DEVELOPMENT_COMMANDS_DIRECTORY = path.resolve(COMMANDS_DIRECTORY, 'development');
const ECLIPSE_COMMANDS_DIRECTORY = path.resolve(COMMANDS_DIRECTORY, 'eclipse');
const ESSENTIALS_COMMANDS_DIRECTORY = path.resolve(COMMANDS_DIRECTORY, 'essentials');
const LEADERSHIP_COMMANDS_DIRECTORY = path.resolve(COMMANDS_DIRECTORY, 'leadership');
const MISC_COMMANDS_DIRECTORY = path.resolve(COMMANDS_DIRECTORY, 'misc');

/**
 * @callback CommandExecute
 * @param {!import('minimist').ParsedArgs} args
 * @returns {void}
 */

/**
 * @typedef Command
 * @type {object}
 * @property {!string} name Name of command, as well as main alias for command
 * @property {!string} description Brief description of command
 * @property {!string} type Type of command
 * @property {!CommandExecute} execute Function to execute on command
 * @property {!number} [args] Number of arguments command should have when called
 * @property {!number} [mentions] Number of mentions command should have when called
 * @property {!string} [details] Detailed descrioption of command
 * @property {!string} [usage] Usage of command, required if args > 0
 * @property {!string[]} [aliases] Different aliases of command that can be called
 */

/**
 * Mapping of command alias to command name.
 * @type {!Map<string, string>}
 */
export const aliases = new Map();

/**
 * Mapping of command alias to command object
 * @type {!Map<string, Command>}
 */
export const commands = new Map();

/**
 * Checks if a command has valid information. This includes mandatory information as well as no
 * duplicate names. Throws if command fails validation.
 * @param {!Command} command Command to check
 * @throws Will throw an error if command fails validotion.
 */
function validCommand(command) {
  let error = '';

  // check validity of command fields that ommand does not duplicate other command aliases
  if (command.name === undefined) {
    error = `Received command with no name: ${toString(command)}`;
  } else if (command.description === undefined) {
    error = `Received command with no description: ${toString(command)}`;
  } else if (command.type === undefined) {
    error = `Received command with no type: ${toString(command)}`;
  } else if (command.execute === undefined || typeof command.execute !== 'function') {
    error = `Received command with invalid execute function: ${toString(command)}`;
  } else if (command.args !== undefined && typeof command.args !== 'number') {
    error = `Received command with invalid args: ${toString(command)}`;
  } else if (command.mentions !== undefined && typeof command.mentions !== 'number') {
    error = `Received command with invalid mentions: ${toString(command)}`;
  } else if (command.aliases !== undefined && !Array.isArray(command.aliases)) {
    error = `Received command with invalid aliases: ${toString(command)}`;
  } else if (aliases.has(command.name)) {
    // check duplicate command name
    error = `Received command "${command.name}" whose name exists in another command "${aliases.get(command.name)}"`;
  } else if (command.aliases !== undefined) {
    // check duplicate command aliases
    command.aliases.some((alias) => {
      if (aliases.has(alias)) {
        error = `Received command "${command.name}" whose alias "${alias}" exists in another command "${aliases.get(alias)}"`;
      }
      return aliases.has(alias);
    });
  }

  if (error !== '') {
    logger.error(error);
    return false;
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
    /** @type {Command} */
    const command = {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      ...require(`../commands/${file}`),
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

export default {
  setUpCommands,
};

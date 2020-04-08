/**
 * Map of command name to whether or not they are busy or not
 * @type {!Map<string, boolean}
 */
const busy = new Map();

/**
 * Checks if command with given command name is busy.
 * @param {!string} commandName Name of command
 */
export function isBusy(commandName) {
  if (!busy.has(commandName)) {
    busy.set(commandName, false);
  }
  return busy.get(commandName);
}

/**
 * Sets a command with given command name as busy.
 * @param {!string} commandName Name of command
 * @param {!number} [durationMs] How long the command is busy for, in milliseconds
 */
export function setBusy(commandName, durationMs) {
  busy.set(commandName, true);
  if (durationMs !== undefined) {
    setTimeout(() => busy.set(commandName, false), durationMs);
  }
}

/**
 * Sets a command with given command name as available.
 * @param {!string} commandName Name of command
 */
export function setAvailable(commandName) {
  busy.set(commandName, false);
}

export default {
  isBusy,
  setBusy,
  setAvailable,
};

/**
 * Map of command name to whether or not they are busy or not
 * @type {!Map<string, boolean>}
 */
const busy = new Map();

/**
 * Checks if command with given command name is busy.
 * @param {!import('./command').Command} command Command to check for
 */
export function isBusy(command) {
  if (!busy.has(command.name)) {
    busy.set(command.name, false);
  }
  return busy.get(command.name);
}

/**
 * Sets a command with given command name as busy.
 * @param {!import('./command').Command} command Command to check for
 * @param {!number} [durationMs] How long the command is busy for, in milliseconds
 */
export function setBusy(command, durationMs) {
  busy.set(command.name, true);
  if (durationMs !== undefined) {
    setTimeout(() => busy.set(command.name, false), durationMs);
  }
}

/**
 * Sets a command with given command name as available.
 * @param {!import('./command').Command} command Command to check for
 */
export function setAvailable(command) {
  busy.set(command.name, false);
}

export default {
  isBusy,
  setBusy,
  setAvailable,
};

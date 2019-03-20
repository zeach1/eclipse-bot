import server from './server';

// Bot time zone.
export const timeZone = 'America/New_York';

// Multiplier to determine exp to level.
export const expMultiplier = 0.24;

// 60 second cooldown for exp.
export const expCooldown = 60;

// Command prefix.
export const prefix = '~';

export { server };

export default {
  timeZone, expMultiplier, prefix, server,
};

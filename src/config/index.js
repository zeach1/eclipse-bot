function isGlitchEnvironment() {
  return process.env.PROJECT_DOMAIN !== undefined;
}

/**
 * Project timezone.
 */
export const TIMEZONE = 'America/New_York';

/**
 * Eclipse's subreddit URL.
 */
export const SUBREDDIT_URL = 'https://www.reddit.com/r/RedditEclipse/';

/**
 * Environment of the project, either "glitch" or "local".
 */
export const PROJECT_ENV = isGlitchEnvironment() ? 'glitch' : 'local';

/**
 * Prefix of the bot, either "+" if in glitch environment, "~" if in local environment.
 */
export const PREFIX = isGlitchEnvironment() ? '+' : '~';

export default {
  TIMEZONE,
  SUBREDDIT_URL,
  PROJECT_ENV,
  PREFIX,
};

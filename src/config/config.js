module.exports = {
  clanName: 'Reddit Eclipse',
  clanTag: '#9RVVPG2J',
  rules: 'https://docs.google.com/document/d/1mXGBzkv_RpjSy_V3dlRa2wJ20Sx55FlJeFl1DvfcBXw',
  password: 'https://www.reddit.com/r/redditclansystem/wiki/official_reddit_clan_system',
  subreddit: 'https://www.reddit.com/r/RedditEclipse/',

  categoryChannel: {
    clan: process.env.CLAN_CATEGORY,
    leadership: process.env.LEADERSHIP_CATEGORY,
    war_room: process.env.WARROOM_CATEGORY,
  },

  channel: {
    leader_notes: process.env.LEADERNOTES,
    leadership: process.env.LEADERSHIP,
    development: process.env.DEVELOPMENT,
    war_discussion: process.env.WARDISCUSSION,
    welcome: process.env.WELCOME,
    wmbot: process.env.WMBOT,
  },

  role: {
    leadership: process.env.LEADERSHIP_ROLE,
  },

  user: {
    jay: process.env.JAY,
    luigi: process.env.LUIGI,
    paul: process.env.PAUL,
    peril: process.env.PERIL,
    prototype: process.env.PROTOTYPE,
    ranch: process.env.RANCH,
  },

  prefix: '+',
  multiplier: 0.24,
  token: process.env.TOKEN,
  api_token: process.env.CLASHAPI_TOKEN,
};

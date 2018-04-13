module.exports = {
  clanName: 'Reddit Eclipse',
  rules: 'https://docs.google.com/document/d/1mXGBzkv_RpjSy_V3dlRa2wJ20Sx55FlJeFl1DvfcBXw',
  password: 'https://www.reddit.com/r/redditclansystem/wiki/official_reddit_clan_system',
  subreddit: 'https://www.reddit.com/r/RedditEclipse/',

  role: {
    leadership: ['Leadership'],
    developer: ['Bot Developer'],
    inwar: ['in war'],
    eclipse: ['Eclipse'],
    friends: ['Friends of Eclipse'],
    member: ['Friends of Eclipse', 'Eclipse', 'Visitor'],
  },

  channelCategory: {
    clan: process.env.CLAN,
    leadership: process.env.LEADERSHIPCATEGORY,
    war_room: process.env.WARROOM,
  },

  channel: {
    leadership: process.env.LEADERSHIPCHANNEL,
    test: process.env.DEVELOPMENT,
    welcome: process.env.WELCOME,
    wmbot: process.env.WMBOT,
  },

  group: {
    leadership: process.env.LEADERSHIP,
  },

  user: {
    jay: process.env.JAY,
    luigi: process.env.LUIGI,
    paul: process.env.PAUL,
    peril: process.env.PERIL,
    prototype: process.env.PROTOTYPE,
  },

  prefix: '+',
  multiplier: 0.24,
  token: process.env.TOKEN,

  noUWords: [
    'stupid', 'frick',
  ],

  badWords: [
    'fuck', 'shit', 'gay', 'bitch', 'tits', 'poach', 'nigger', 'cunt', 'cock', 'dick', 'retard',
  ],
};

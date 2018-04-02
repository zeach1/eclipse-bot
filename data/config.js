module.exports = {
  clanName: 'Reddit Eclipse',
  rules: '',
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
    test: process.env.BOT_TESTING,
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

  blacklisted: [],

  prefix: '+',
  multiplier: 0.24,
  token: process.env.TOKEN,

  /* Words that trigger NO U */
  thonkWords: [
    'stupid',
  ],

  /* Don't look, bad words */
  filterWords: [
    'poach', 'nigger',
  ],
};

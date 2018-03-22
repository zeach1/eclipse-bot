module.exports = {
  clanName: 'Reddit Eclipse',
  rules: 'https://bit.ly/RE-Rules',
  password: 'https://bit.ly/RCSpassword',
  subreddit: 'https://www.reddit.com/r/RedditEclipse/',

  role: {
    leadership: ['Leadership'],
    developer: ['Bot Developer'],
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

  prefix: '+',
  multiplier: 0.24,
  token: process.env.TOKEN,

  /* Don't look, bad words */
  filterWords: [
    'poach', 'nigger',
  ],
};

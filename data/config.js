module.exports = {
  rules: 'https://bit.ly/RE-Rules',
  password: 'https://bit.ly/RCSpassword',

  role: {
    leadership: ['Leadership'],
    developer: ['Bot Developer'],
    eclipse: ['Eclipse'],
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
    paul: process.env.PAUL,
    peril: process.env.PERIL,
    prototype: process.env.PROTOTYPE,
  },

  prefix: '+',
  token: process.env.TOKEN,
};

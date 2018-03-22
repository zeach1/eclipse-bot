module.exports = {
  getEmoji: function(name, client) {
    console.log(name);
    const emojis = [];
    if (emojis.includes(name))
      return name;

    const key = name.slice(2).slice(name.indexOf(':'), -1);
    return client.emojis.get(key);
  },
};

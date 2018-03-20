const outdent = require('outdent');

const { channelCategory } = require('../data/config.js');

const messenger = require('../helper/messenger.js');

module.exports = {
  name: 'scout',
  type: 'essentials',
  description: 'Tips for a scout in war',

  execute: async function(message) {
    /* Command output message bound to change soon */
    if (message.channel.parentID === channelCategory.war_room)
      return message.channel.send(outdent({ 'trimLeadingNewline': true })`
        \:arrow_forward: Bring 4 archers to test each corner of the base for teslas
        \:arrow_forward: Make sure to pull all cc, ground and air. If you're going air, bring a couple of hogs for mid/end raid to pull the ground cc.
        \:arrow_forward: 2 stars and 51% destruction
        \:arrow_forward: Priorities:
        \:small_blue_diamond: Clan Castle
        \:small_blue_diamond: Percentage
        \:small_blue_diamond: Surface to Air traps
        \:small_blue_diamond: Skeleton Traps
        \:small_blue_diamond: Giant Bombs
        \:arrow_forward: Common comps (customize your comp for the base):
        \:small_blue_diamond: Queen Walk air or ground
        \:small_blue_diamond: Queen Walk GoVaBo
        \:small_blue_diamond: Hogs and baby dragons
      `);

    return messenger.sendError(message, {
      message: 'You can\'t call this command here',
      submessage: 'You can only use this in the War Room',
    });
  },
};

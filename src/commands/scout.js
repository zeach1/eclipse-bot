'use strict';

const { categoryChannel } = require('../config/config.js');
const Messenger = require('../helper/Messenger.js');
const outdent = require('outdent');

class Command {
  constructor() {
    this.name = 'scout';

    this.description = 'Tips for a scout in war';
    this.type = 'misc';
  }

  execute(message) {
    /* Command output message bound to change soon */
    if (message.channel.parentID === categoryChannel.war_room) {
      message.channel.send(outdent`
        ${outdent}
        \:arrow_forward: Bring 4 archers to test each corner of the base for teslas
        \:arrow_forward: Make sure to pull all cc, ground and air. If you're going air, bring a couple of hogs for mid/end raid to pull the ground cc.

        \:arrow_forward: Priorities:
        \:small_blue_diamond: Clan Castle
        \:small_blue_diamond: Surface to Air traps
        \:small_blue_diamond: Skeleton Traps
        \:small_blue_diamond: Giant Bombs
        \:small_blue_diamond: Percentage
        \:arrow_forward: Common comps (customize your comp for the base):
        \:small_blue_diamond: Queen Walk air or ground
        \:small_blue_diamond: Queen Walk GoVaBo
        \:small_blue_diamond: Hogs and baby dragons
      `);
    } else {
      Messenger.sendError(message, {
        title: '◀️ Wrong Channel',
        message: 'You can\'t call this command here',
        submessage: 'You can only use this in the War Room',
      });
    }
  }
}

module.exports = new Command();

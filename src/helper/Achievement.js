const ClashAPI = require('./ClashAPI.js');
const fs = require('fs');
const Messenger = require('./Messenger.js');
const path = require('path');
const Util = require('./Util.js');

const ACHIEVEMENTPATH = path.join(__dirname, '..', '..', 'data', 'achievements');

let working = false;

function getAchievementFilePath(achievementName) {
  return path.join(ACHIEVEMENTPATH, `${achievementName.toLowerCase().replace(/ /g, '-')}.json`);
}

function displayResultMessage(message, check, info) {
  // quietly exists if no description
  if (!info || !info.success || !info.error || !info.success.title || !info.success.description || !info.error.message || !info.error.submessage) return;

  if (check) {
    Messenger.sendSuccessMessage(message, {
      title: info.success.title,
      description: info.success.description,
    });
  } else {
    Messenger.sendError(message, {
      message: info.error.message,
      submessage: info.error.submessage,
    });
  }
}

function getFileData(message, achievementName, info) {
  const data = Util.loadFromJSON(getAchievementFilePath(achievementName));

  if (!data) {
    info.title = ''; info.description = '';
    displayResultMessage(message, false, info);
  }

  return data;
}

async function getAPIData(message, achievementName) {
  working = true;
  const accounts = await ClashAPI.getClanMembers(message).catch(e => Messenger.sendDeveloperError(message, e));

  // API login issues
  if (!accounts) {
    working = false;
    return null;
  }

  const data = [];
  for (const account of accounts) {
    const achievement = account.achievements.find(a => a.name === achievementName);
    data.push({ name: account.name, tag: account.tag, value: achievement.value });
  }

  working = false;
  return data;
}

function saveData(message, achievementName, data, info) {
  if (!fs.existsSync(ACHIEVEMENTPATH)) fs.mkdirSync(ACHIEVEMENTPATH);
  const success = Util.saveToJSON(getAchievementFilePath(achievementName), data);

  // always display result after saving
  displayResultMessage(message, success, info);
  return success;
}

class Achievement {
  static getAchievementFilePath(achievementName) {
    return getAchievementFilePath(achievementName);
  }

  static loadFileData(message, achievementName, info) {
    return getFileData(message, achievementName, info);
  }

  static loadAPIData(message, achievementName) {
    if (working) return null;
    return getAPIData(message, achievementName);
  }

  static saveData(message, achievementName, data, info) {
    return saveData(message, achievementName, data, info);
  }

  static fix() {
    working = false;
  }
}

module.exports = Achievement;

const fs = require('fs');

class Util {
  static match(string, targetString, excludeSymbols, excludeNumber) {
    let filteredString = string.toLowerCase().replace(/ /g, '');
    let filteredTargetString = targetString.toLowerCase().replace(/ /g, '');

    if (excludeSymbols) {
      const regex = excludeNumber ? /[^a-z]/g : /[^a-z0-9]/g;
      filteredString = string.replace(regex, '');
      filteredTargetString = targetString.replace(regex, '');
    }

    // targetString should be longer than string, if they're not the same
    return filteredString === filteredTargetString
      || filteredTargetString.startsWith(string)
      || filteredTargetString.includes(string);
  }

  static sort(array, guildMemberCollection, sortByLength) {
    return array.sort((a, b) => {
      const aName = guildMemberCollection ? a.displayName.toLowerCase() : a.toLowerCase();
      const bName = guildMemberCollection ? b.displayName.toLowerCase() : b.toLowerCase();

      if (sortByLength) {
        return aName.length - bName.length;
      }

      if (aName > bName) {
        return 1;
      }
      if (aName < bName) {
        return -1;
      }
      return 0;
    });
  }

  static cleanString(string) {
    return string
      .toLowerCase()
      .replace(/[^a-z ]/g, '')
      .replace(/ +/g, ' ');
  }

  static loadFromJSON(filePath) {
    let data = null;
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(fileData);
    } catch (e) {} // eslint-disable-line

    return data;
  }

  static saveToJSON(filePath, data) {
    if (!data) {
      return false;
    }

    let successful;
    try {
      const fileData = JSON.stringify(data);
      fs.writeFileSync(filePath, fileData);
      successful = true;
    } catch (e) {
      successful = false;
    }

    return successful;
  }
}

module.exports = Util;

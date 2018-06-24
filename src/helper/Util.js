const fs = require('fs');

class Util {
  static match(string, targetString, excludeSymbols, excludeNumber) {
    string = string.toLowerCase().replace(/ /g, '');
    targetString = targetString.toLowerCase().replace(/ /g, '');

    if (excludeSymbols) {
      const regex = excludeNumber ? /[^a-z]/g : /[^a-z0-9]/g;
      string = string.replace(regex, '');
      targetString = targetString.replace(regex, '');
    }

    // targetString should be longer than string, if they're not the same
    return string === targetString || targetString.startsWith(string) || targetString.includes(string);
  }

  static sort(array, guildMemberCollection, sortByLength) {
    return array.sort((a, b) => {
      a = guildMemberCollection ? a.displayName.toLowerCase() : a.toLowerCase();
      b = guildMemberCollection ? b.displayName.toLowerCase() : b.toLowerCase();

      if (sortByLength) return a.length > b.length ? 1 : a.length < b.length ? -1 : 0;
      return a > b ? 1 : a < b ? -1 : 0;
    });
  }

  static cleanString(string) {
    return string
      .toLowerCase()
      .replace(/[^a-z ]/g, '')
      .replace(/ +/g, ' ');
  }

  static getDateTimeLocale(date, locale, options) {
    const defaultTimeZone = 'America/New_York';
    const defaultLocale = 'en-US';

    const dateOptions = options ? {
      year: options.year,
      month: options.month,
      day: options.day,
    } : {};

    const timeOptions = options ? {
      hour: options.hour,
      minute: options.minute,
      timeZoneName: options.timeZoneName,
    } : {};

    dateOptions.timeZone = options && options.timeZone ? options.timeZone : defaultTimeZone;
    timeOptions.timeZone = options && options.timeZone ? options.timeZone : defaultTimeZone;

    return {
      date: date.toLocaleDateString(locale || defaultLocale, dateOptions),
      time: date.toLocaleTimeString(locale || defaultLocale, timeOptions),
    };
  }

  static loadFromJSON(filePath) {
    let data;
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(fileData);
    } catch (e) {} // eslint-disable-line

    return data;
  }

  static saveToJSON(filePath, data) {
    if (!data) {
      console.error('Data being saved is null');
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

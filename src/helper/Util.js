'use strict';

class Util {
  static match(string, targetString, excludeSymbols) {
    string = string.toLowerCase().replace(/ /g, '');
    targetString = targetString.toLowerCase().replace(/ /g, '');

    if (excludeSymbols) {
      string = string.replace(/[^a-z0-9]/g, '');
      targetString = targetString.replace(/[^a-z0-9]/g, '');
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

    if (options && options.timeZone) {
      dateOptions.timeZone = options.timeZone;
      timeOptions.timeZone = options.timeZone;
    }

    return {
      date: date.toLocaleDateString(locale, dateOptions),
      time: date.toLocaleTimeString(locale, timeOptions),
    };
  }
}

module.exports = Util;

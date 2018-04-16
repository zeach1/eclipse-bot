module.exports = {
  /**
   * Checks if a name matches a certain name. Used to add user friendliness when
   * referencing other users, but not tagging them directly.
   * @param {string} name Name that user uses to reference other user
   * @param {string} targetName Full name of referenced user
   * @return {boolean} true if name matches
   */
  match: function(name, targetName) {
    name = name.toLowerCase();
    targetName = targetName.toLowerCase();

    return name === targetName || name.startsWith(targetName) || name.includes(targetName);
  },

  /**
   * Removes any mentions in an array of references.
   * @param {Array<string>} names the array of references
   * @return {Array<string>} same array without mentions
   */
  filterTags: function(names) {
    return names.filter(name => name.startsWith('<'));
  },

  /**
   * Orders an array of string, ignoring case
   * @param {Array<string>} array`
   * @return {Array<string>}
   */
  inOrder: function(array) {
    return array.sort((a, b) => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      return a > b ? 1 : a < b ? -1 : 0;
    });
  },
};

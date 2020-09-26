const getMatchingWords = (text, regex) => {
  const matches = text.match(regex).map((word) => word.toLowerCase());
  return matches;
};

module.exports = getMatchingWords;

const getMatchingWords = require("./getMatchingWords");

const getStats = (text) => {
  let res = {};
  res.frequent = [];
  const regex = /\w+/gi;
  const allWords = getMatchingWords(text, regex);
  if (!allWords) {
    throw Error;
  }
  res.numWords = allWords.length;
  const uniqueWords = [...new Set(allWords)];
  uniqueWords.forEach((word) => {
    let count = allWords.reduce((n, x) => n + (x === word), 0);
    res.frequent.push({ word, count });
  });
  res.frequent.sort((a, b) => (a.count > b.count ? -1 : 1));
  let endIndex;
  if (res.frequent.length >= 12) {
    endIndex = 12;
  } else {
    endIndex = res.frequent.length;
  }
  res.frequent = res.frequent.slice(0, endIndex);
  return res;
};

module.exports = getStats;

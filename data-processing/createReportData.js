const _ = require("lodash");
const fs = require("fs");
const d3 = require("d3");
const mkdirp = require("mkdirp");
const { stopWords } = require("./stopWords.js");

const data = d3.csvParse(fs.readFileSync("./cleaned.csv", "utf-8"));
const years = _.range(2014, 2021);

const report = {};
_.forEach(years, (year) => {
  const yearReport = {};
  const videosForThisYear = data.filter((d) => {
    const date = new Date(d.timestamp);
    return (
      date.getFullYear() === year &&
      d.channelName !== "Michelle McGhee" && // removing me watching my own videos
      d.channelName !== "Ashlea Birthday" &&
      d.channelName !== "Yoga With Adriene" && // Beara watched these
      !d.title.includes("Bombshell (2019 Movie) New Trailer")
    );
  });

  const numVideos = videosForThisYear.length;
  yearReport["numVideos"] = numVideos;

  const channelCounts = _.countBy(videosForThisYear, (v) => v.channelName);
  const sortedChannels = _.orderBy(
    _.keys(channelCounts),
    (d) => channelCounts[d],
    "desc"
  );
  const top10Channels = sortedChannels
    .slice(0, 10)
    .map((channel) => ({ channel, count: channelCounts[channel] }));
  yearReport["top10Channels"] = top10Channels;

  const videoCounts = _.countBy(videosForThisYear, (v) => v.title);
  const sortedVideos = _.orderBy(
    _.keys(videoCounts),
    (d) => videoCounts[d],
    "desc"
  );
  const top10Videos = sortedVideos
    .slice(0, 10)
    .map((video) => ({ video, count: videoCounts[video] }));
  yearReport["top10Videos"] = top10Videos;

  const wordCounts = {};
  _.forEach(videosForThisYear, (v) => {
    const words = _.words(v.title).map((w) => w.toLowerCase());
    _.forEach(words, (word) => {
      if (!stopWords.includes(word) && isNaN(word)) {
        if (word in wordCounts) {
          wordCounts[word] += 1;
        } else {
          wordCounts[word] = 1;
        }
      }
    });
  });
  const sortedWords = _.orderBy(
    _.keys(wordCounts),
    (d) => wordCounts[d],
    "desc"
  );
  const top10Words = sortedWords
    .slice(0, 10)
    .map((word) => ({ word, count: wordCounts[word] }));
  yearReport["top10Words"] = top10Words;

  report[year] = yearReport;
});

// overall
const overallReport = {};
const allVideos = data.filter((d) => {
  const date = new Date(d.timestamp);
  return (
    d.channelName !== "Michelle McGhee" && // removing me watching my own videos
    d.channelName !== "Ashlea Birthday" &&
    d.channelName !== "Yoga With Adriene" && // Beara watched these
    !d.title.includes("Bombshell (2019 Movie) New Trailer")
  );
});

const numVideos = allVideos.length;
overallReport["numVideos"] = numVideos;

const channelCounts = _.countBy(allVideos, (v) => v.channelName);
const sortedChannels = _.orderBy(
  _.keys(channelCounts),
  (d) => channelCounts[d],
  "desc"
);
const top10Channels = sortedChannels
  .slice(0, 10)
  .map((channel) => ({ channel, count: channelCounts[channel] }));
overallReport["top10Channels"] = top10Channels;

const videoCounts = _.countBy(allVideos, (v) => v.title);
const sortedVideos = _.orderBy(
  _.keys(videoCounts),
  (d) => videoCounts[d],
  "desc"
);
const top10Videos = sortedVideos
  .slice(0, 10)
  .map((video) => ({ video, count: videoCounts[video] }));
overallReport["top10Videos"] = top10Videos;

const wordCounts = {};
_.forEach(allVideos, (v) => {
  const words = _.words(v.title).map((w) => w.toLowerCase());
  _.forEach(words, (word) => {
    if (!stopWords.includes(word) && isNaN(word)) {
      if (word in wordCounts) {
        wordCounts[word] += 1;
      } else {
        wordCounts[word] = 1;
      }
    }
  });
});
const sortedWords = _.orderBy(_.keys(wordCounts), (d) => wordCounts[d], "desc");
const top10Words = sortedWords
  .slice(0, 10)
  .map((word) => ({ word, count: wordCounts[word] }));
overallReport["top10Words"] = top10Words;

report["overall"] = overallReport;

fs.writeFileSync("../src/data/report.json", JSON.stringify(report), "utf8");

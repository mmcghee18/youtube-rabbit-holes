const _ = require("lodash");
const fs = require("fs");
const d3 = require("d3");
const mkdirp = require("mkdirp");
const { stopWords } = require("./stopWords.js");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const data = d3.csvParse(fs.readFileSync("./cleaned.csv", "utf-8"));
const years = _.range(2014, 2021);

const result = {};
_.forEach(years, (year) => {
  const videosForThisYear = data.filter((d) => {
    const date = new Date(d.timestamp);
    return (
      date.getFullYear() === year &&
      d.channelName !== "Michelle McGhee" && // removing me watching my own videos
      d.channelName !== "Ashlea Birthday"
    );
  });

  const channelCounts = _.countBy(videosForThisYear, (v) => v.channelName);
  const sortedChannels = _.orderBy(
    _.keys(channelCounts),
    (d) => channelCounts[d],
    "desc"
  );
  const channelThreshold = 0.05;
  const topChannels = sortedChannels.slice(
    0,
    sortedChannels.length * channelThreshold
  );

  const videoCounts = _.countBy(videosForThisYear, (v) => v.title);
  const sortedVideos = _.map(
    _.orderBy(_.keys(videoCounts), (d) => videoCounts[d], "desc"),
    (title) => {
      const findChannel = _.find(
        videosForThisYear,
        _.matchesProperty("title", title)
      );
      return {
        title,
        views: videoCounts[title],
        channelName: findChannel.channelName,
      };
    }
  );

  const radiusScale = d3
    .scaleLinear()
    .domain([1, channelCounts[topChannels[0]]])
    .range([5, 25]);

  const categories = topChannels.map((channel) => {
    const videosInCategory = sortedVideos
      .filter((v) => v.channelName === channel)
      .map(({ title, views }) => ({ title, views }));
    return {
      category: channel,
      videos: videosInCategory,
      raidus: radiusScale(videosInCategory.length),
    };
  });
  result[year] = categories;
});

fs.writeFileSync(
  "../essay/src/data/categories.json",
  JSON.stringify(result),
  "utf8"
);
console.log("done!");

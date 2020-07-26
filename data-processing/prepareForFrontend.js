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

// each video should become -> {id, radius, category}
// - id will be video title
// - radius will be a function of views of that video in that year
// - category: if its channel is in the top 50%, category = channel
// otherwise, if a word in the title is in the top 50%, category = word
// rest are in a category "other"

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
        count: videoCounts[title],
        channelName: findChannel.channelName,
      };
    }
  );

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

  const radiusScale = d3
    .scaleLinear()
    .domain([1, videoCounts[sortedVideos[0]]])
    .range([5, 25]);

  result[year] = sortedVideos.map((v) => {
    let category = "";
    if (topChannels.includes(v.channelName)) {
      category = v.channelName;
    } else {
      category = "other";
    }
    return {
      id: v,
      radius: radiusScale(videoCounts[v]),
      category,
    };
  });
});

fs.writeFileSync("../src/data/videos.json", JSON.stringify(result), "utf8");

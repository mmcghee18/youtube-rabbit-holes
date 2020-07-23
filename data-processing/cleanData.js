const _ = require("lodash");
const fs = require("fs");
const d3 = require("d3");
const mkdirp = require("mkdirp");
const rawData = require("./watch-history.json");

const cleanTitle = (title) => {
  return title.replace("Watched ", "");
};

const filteredData = rawData.filter(
  (d) =>
    !d.title.includes("a video that has been removed") &&
    !d.title.includes("Watched https://")
);

const result = filteredData.map((d) => {
  return {
    title: cleanTitle(d.title),
    url: d.titleUrl,
    channelName: d.subtitles ? d.subtitles[0].name : null,
    timestamp: d.time,
  };
});

fs.writeFileSync("./cleaned.csv", d3.csvFormat(result), "utf8");

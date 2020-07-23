const _ = require("lodash");
const fs = require("fs");
const d3 = require("d3");
const mkdirp = require("mkdirp");

const data = d3.csvParse(fs.readFileSync("./cleaned.csv", "utf-8"));

const channels = _.uniq(data.map((d) => d.channelName));
const channelCounts = _.countBy(data, (d) => d.channelName);

const sortedChannels = _.orderBy(
  _.keys(channelCounts),
  (d) => channelCounts[d],
  "asc"
);

_.forEach(sortedChannels, (channel) => {
  console.log(`${channel} : ${channelCounts[channel]}`);
});

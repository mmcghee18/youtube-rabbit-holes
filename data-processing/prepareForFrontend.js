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

  const videoCounts = _.countBy(videosForThisYear, (v) => v.title);
  const nodes = _.map(_.keys(videoCounts), (title, i) => {
    const channelName = _.find(
      videosForThisYear,
      _.matchesProperty("title", title)
    ).channelName;
    return {
      id: i,
      name: title,
      val: videoCounts[title],
      channelName,
      category: channelName,
    };
  });

  // Linking categories

  // list of categories (channels)
  // for each category, filter out the nodes that have it
  //  connect every one of those nodes

  const categories = _.uniq(videosForThisYear.map((v) => v.channelName));
  const links = [];
  _.forEach(categories, (category) => {
    const matchingNodes = nodes.filter((node) => node.channelName === category);

    for (let i = 0; i < matchingNodes.length; i++) {
      // Connect every node to a random node
      if (matchingNodes.length > 1) {
        const source = matchingNodes[i].id;
        let target = null;
        while (target === source || target === null) {
          target = matchingNodes[_.random(matchingNodes.length - 1)].id;
        }
        links.push({
          source,
          target,
        });

        target = null;
        while (target === source || target === null) {
          target = matchingNodes[_.random(matchingNodes.length - 1)].id;
        }
        links.push({
          source,
          target,
        });
      }

      // *** Connect every node to every other node
      // for (let j = 0; j < matchingNodes.length; j++) {
      //   if (i !== j) {
      //     links.push({
      //       source: matchingNodes[i].id,
      //       target: matchingNodes[j].id,
      //     });
      //   }
      // }
    }
  });

  result[year] = { nodes, links };

  // const channelCounts = _.countBy(videosForThisYear, (v) => v.channelName);
  // const sortedChannels = _.orderBy(
  //   _.keys(channelCounts),
  //   (d) => channelCounts[d],
  //   "desc"
  // );
  // const channelThreshold = 0.05;
  // const topChannels = sortedChannels.slice(
  //   0,
  //   sortedChannels.length * channelThreshold
  // );

  // const radiusScale = d3
  //   .scaleLinear()
  //   .domain([1, channelCounts[topChannels[0]]])
  //   .range([5, 25]);

  // const categories = topChannels.map((channel) => {
  //   const videosInCategory = sortedVideos
  //     .filter((v) => v.channelName === channel)
  //     .map(({ title, views }) => ({ title, views }));
  //   return {
  //     category: channel,
  //     videos: videosInCategory,
  //     raidus: radiusScale(videosInCategory.length),
  //   };
  // });
  // result[year] = categories;
});

fs.writeFileSync(
  "../essay/src/data/graph.json",
  JSON.stringify(result),
  "utf8"
);
console.log("done!");

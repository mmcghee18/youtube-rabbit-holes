import * as d3 from "d3";
import _ from "lodash";

export const initiateForce = ({ nodes, numCategories, width, height }) => {
  const colors = ["cornflowerblue", "orange", "#B19CD9"];
  const xCenters = _.range(1, numCategories + 1).map(
    (x) => (x * width) / numCategories
  );

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(0)) // attract
    .force("center", d3.forceCenter(width / 2, height / 2)) // center
    .force(
      // avoid overlap
      "collision",
      d3.forceCollide().radius((d) => d.radius)
    )
    .on("tick", ticked)
    .force(
      // align X
      "x",
      d3.forceX().x((d) => xCenters[d.category])
    );

  const ticked = () => {
    // links my nodes with circles on the dom
    const u = d3
      .select("svg")
      .selectAll("circle")
      .data(nodes, (d) => d.id); // give each circle a unique id
    // nodes without circles? let's add em
    u.enter()
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => colors[d.category])
      .merge(u)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    // more circles than nodes? remove em
    u.exit().remove();
  };
};

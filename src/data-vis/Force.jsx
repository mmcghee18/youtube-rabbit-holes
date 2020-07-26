import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import _ from "lodash";
import useChartDimensions from "../hooks/useChartDimensions.js";
import videos from "../data/videos.json";

const Force = ({ nodes, year }) => {
  const [ref, dms] = useChartDimensions({});
  const svgWidth = dms.boundedWidth;
  const svgHeight = dms.boundedHeight;

  const colors = ["cornflowerblue", "orange", "#B19CD9"];
  const xScale = d3
    .scaleLinear()
    .domain([1, 3])
    .range([100, svgWidth - 100]);

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
      .attr("opacity", 0.5)
      .merge(u)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    // more circles than nodes? remove em
    u.exit().remove();
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      // align X
      "x",
      d3.forceX().x((d) => xScale(d.category))
    )
    .force("charge", d3.forceManyBody().strength(2)) // attract
    .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2)) // center
    .force(
      // avoid overlap
      "collision",
      d3.forceCollide().radius((d) => d.radius / 2)
    )
    .on("tick", ticked);

  useEffect(() => {
    simulation.stop();
    simulation.restart();
  }, [nodes]);

  return (
    <>
      <div
        id="wrapper"
        ref={ref}
        style={{ height: "90vh", position: "sticky", top: 0 }}
      >
        <svg height={svgHeight} width={svgWidth} />
      </div>
    </>
  );
};

export default Force;

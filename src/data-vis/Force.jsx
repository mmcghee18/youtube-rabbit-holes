import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash";
import useChartDimensions from "../hooks/useChartDimensions.js";
import categories from "../data/categories.json";

const Force = ({ nodes, year }) => {
  const canvasRef = useRef(null);
  const [canvasContext, setCanvasContext] = useState(null);
  //const [forceSimulation, setForceSimulation] = useState(null);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    setCanvasContext(context);
    console.log("context set");
  }, []);

  const [ref, dms] = useChartDimensions({});
  const svgWidth = dms.boundedWidth;
  const svgHeight = dms.boundedHeight;

  const colors = ["cornflowerblue", "orange", "#B19CD9"];
  const xScale = d3
    .scaleLinear()
    .domain([0, categories[year].length - 1])
    .range([0, svgWidth]);
  const yScale = d3
    .scaleLinear()
    .domain([0, categories[year].length - 1])
    .range([0, svgHeight]);

  const ticked = () => {
    _.forEach(nodes, (node) => {
      canvasContext.fillStyle = colors[categories[year].indexOf(node.category)];
      canvasContext.beginPath();
      canvasContext.arc(node.x, node.y, node.radius, 0, 2 * Math.PI, true);
      canvasContext.fill();
      canvasContext.closePath();
    });

    // links my nodes with circles on the dom
    // const u = d3
    //   .select("canvas")
    //   .selectAll("circle")
    //   .data(nodes, (d) => d.id); // give each circle a unique id
    // // nodes without circles? let's add em
    // u.enter()
    //   .append("circle")
    //   .attr("r", (d) => d.radius)
    //   .attr("fill", (d) => colors[categories[year].indexOf(d.category)])
    //   .attr("opacity", 0.5)
    //   .merge(u)
    //   .attr("cx", (d) => d.x)
    //   .attr("cy", (d) => d.y);

    // // more circles than nodes? remove em
    // u.exit().remove();
  };

  if (canvasContext !== null) {
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        // align X
        "x",
        d3.forceX().x((d) => xScale(categories[year].indexOf(d.category)))
      )
      .force(
        // align Y
        "y",
        d3.forceY().y((d) => yScale(categories[year].indexOf(d.category)))
      )
      .force("charge", d3.forceManyBody().strength(2)) // attract
      // .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2)) // center
      .force(
        // avoid overlap
        "collision",
        d3.forceCollide().radius((d) => d.radius)
      )
      .on("tick", ticked);
  }

  // useEffect(() => {
  //   forceSimulation.stop();
  //   forceSimulation.restart();
  // }, [nodes]);

  return (
    <>
      <div
        id="wrapper"
        ref={ref}
        style={{ height: "90vh", position: "sticky", top: 0 }}
      >
        {/* <svg height={svgHeight} width={svgWidth} /> */}
        <canvas
          ref={canvasRef}
          id="canvas"
          height={svgHeight}
          width={svgWidth}
        />
      </div>
    </>
  );
};

export default Force;

import React, { useState } from "react";
import _ from "lodash";
import useChartDimensions from "./hooks/useChartDimensions.js";
import AnimatedCircle from "./data-vis/AnimatedCircle.jsx";

const Canvas = ({ year }) => {
  const chartSettings = {};
  const [ref, dms] = useChartDimensions(chartSettings);

  const data = {
    2014: [
      { title: "Coming Out", channel: "Harto", category: "category1" },
      { title: "Yay", channel: "Gay", category: "category1" },
      { title: "sport", channel: "Sportz", category: "category2" },
    ],
    2015: [
      { title: "Coming Out", channel: "Harto", category: "category1" },
      { title: "Yay", channel: "Gay", category: "category1" },
      { title: "sport", channel: "Sportz", category: "category2" },
    ],
    2016: [
      { title: "Coming Out", channel: "Harto", category: "category1" },
      { title: "Yay", channel: "Gay", category: "category1" },
      { title: "sport", channel: "Sportz", category: "category2" },
    ],
    2017: [
      { title: "Coming Out", channel: "Harto", category: "category1" },
      { title: "Yay", channel: "Gay", category: "category1" },
      { title: "sport", channel: "Sportz", category: "category2" },
    ],
    2018: [
      { title: "Coming Out", channel: "Harto", category: "category1" },
      { title: "Yay", channel: "Gay", category: "category1" },
      { title: "sport", channel: "Sportz", category: "category2" },
    ],
    2019: [
      { title: "Coming Out", channel: "Harto", category: "category1" },
      { title: "Yay", channel: "Gay", category: "category1" },
      { title: "sport", channel: "Sportz", category: "category2" },
    ],
    2020: [
      { title: "Coming Out", channel: "Harto", category: "category1" },
      { title: "Yay", channel: "Gay", category: "category1" },
      { title: "sport", channel: "Sportz", category: "category2" },
    ],
  };

  return (
    <div
      ref={ref}
      style={{ height: "90vh", marginLeft: "50px", marginRight: "50px" }}
    >
      <svg width={dms.width} height={dms.height}>
        {data[year].map((data) => (
          <AnimatedCircle isShowing={true} data={data} />
        ))}
      </svg>
    </div>
  );
};

export default Canvas;

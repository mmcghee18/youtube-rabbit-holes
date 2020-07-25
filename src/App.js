import React, { useEffect, useState } from "react";
import "./App.css";
import * as d3 from "d3";
import { initiateForce } from "./data-vis/forceLayout.js";
import useChartDimensions from "./hooks/useChartDimensions.js";

function App() {
  const [ref, dms] = useChartDimensions({});

  const [nodes, setNodes] = useState(null);

  useEffect(() => {
    setNodes(generateData());
  }, []);

  const generateData = () => {
    const numNodes = 100;
    const nodes = d3.range(numNodes).map((d) => {
      return {
        id: Math.floor(Math.random() * 10000),
        radius: Math.random() * 25,
        category: Math.floor(Math.random() * 3),
      };
    });
    return nodes;
  };

  useEffect(() => {
    if (nodes !== null && nodes.length) {
      initiateForce({
        nodes,
        width: dms.boundedWidth,
        height: dms.boundedHeight,
      });
    }
  }, [dms]);

  return (
    <div className="App">
      <div id="wrapper" ref={ref} style={{ height: "90vh" }}>
        <svg height={dms.boundedHeight} width={dms.boundedWidth} />
      </div>
      <button onClick={() => setNodes(generateData())}>new data</button>
    </div>
  );
}

export default App;

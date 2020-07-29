import React from "react";
import "./App.css";
import _ from "lodash";
import { ForceGraph3D } from "react-force-graph";
import graph from "./data/graph.json";

function App() {
  const generateRandomData = () => {
    const nodes = _.range(0, 100).map((i) => ({
      id: `id${i}`,
      name: `name${i}`,
      val: Math.random() * 20,
    }));
    const links = _.range(0, 20).map((i) => ({
      source: `id${_.random(0, 99)}`,
      target: `id${_.random(0, 99)}`,
    }));
    return { nodes, links };
  };

  const graphData = graph[2020];

  return (
    <div className="App">
      <ForceGraph3D
        graphData={graphData}
        nodeColor={(d) => {
          return d.__indexColor;
        }}
      />
    </div>
  );
}

export default App;

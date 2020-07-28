import React from "react";
import "./App.css";
import _ from "lodash";
import { ForceGraph3D } from "react-force-graph";

function App() {
  const generateRandomData = () => {
    const nodes = _.range(0, 10000).map((i) => ({
      id: `id${i}`,
      name: `name${i}`,
      val: Math.random() * 20,
    }));
    const links = [];
    return { nodes, links };
  };

  const myData = generateRandomData();
  return (
    <div className="App">
      <ForceGraph3D graphData={myData} />
    </div>
  );
}

export default App;

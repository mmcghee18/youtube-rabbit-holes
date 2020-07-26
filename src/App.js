import React, { useState } from "react";
import "./App.css";
import _ from "lodash";
import Force from "./data-vis/Force.jsx";
import videos from "./data/videos.json";
import { Scrollama, Step } from "react-scrollama";

function App() {
  const startYear = 2014;
  const endYear = 2020;
  const [currentYear, setCurrentYear] = useState(startYear);

  const nodes = videos[currentYear] ? videos[currentYear].slice(0, 50) : null;
  console.log(currentYear, nodes);

  const onStepEnter = ({ data }) => {
    setCurrentYear(data);
  };

  return (
    <div className="App">
      <Force nodes={nodes} year={currentYear} />
      <Scrollama onStepEnter={onStepEnter} debug>
        {_.range(startYear, endYear + 1).map((year, stepIndex) => (
          <Step data={year} key={stepIndex}>
            <div
              style={{
                margin: "70vh 0",
              }}
            >
              <h1>{year}</h1>
            </div>
          </Step>
        ))}
      </Scrollama>
    </div>
  );
}

export default App;

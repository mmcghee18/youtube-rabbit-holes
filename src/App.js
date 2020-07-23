import React, { useState } from "react";
import { Scrollama, Step } from "react-scrollama";
import _ from "lodash";
import Canvas from "./Canvas.jsx";

function App() {
  const startYear = 2014;
  const endYear = 2020;

  const [year, setYear] = useState(null);
  const onStepEnter = ({ data }) => {
    setYear(data);
  };

  return (
    <div className="App">
      <div style={{ position: "sticky", top: 0 }}>
        {year && <Canvas year={year} />}
      </div>
      <Scrollama onStepEnter={onStepEnter}>
        {_.range(startYear, endYear + 1).map((stepData) => (
          <Step data={stepData} key={stepData}>
            <div style={{ margin: "50vh 0", textAlign: "center" }}>
              {stepData}
            </div>
          </Step>
        ))}
      </Scrollama>
    </div>
  );
}

export default App;

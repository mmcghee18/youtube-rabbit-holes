import React, { useState } from "react";
import "./App.css";
import _ from "lodash";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import report from "./data/report.json";
import Report from "./Report.jsx";

function App() {
  const startYear = 2014;
  const endYear = 2020;

  const [year, setYear] = useState("overall");

  return (
    <div className="App">
      <AntDropDown startYear={startYear} endYear={endYear} setYear={setYear} />
      <Report year={year} data={report[year]} />
    </div>
  );
}

const AntDropDown = ({ startYear, endYear, setYear }) => {
  const menu = (
    <Menu>
      {_.range(startYear, endYear + 1).map((year) => (
        <Menu.Item>
          <div onClick={() => setYear(year)}>{year}</div>
        </Menu.Item>
      ))}
      <Menu.Item>
        <div onClick={() => setYear("overall")}>Overall</div>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        Select Year <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default App;

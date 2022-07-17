/* eslint-disable */
import React, { useState, useEffect } from "react";
import "./App.css";
import LineChart from "./Charts/LineChart";
import TimeSeries from "./Charts/TimeSeries";
import Histogram from "./Charts/Histogram";
import Weather from "./Charts/NYCTemperature2018";
import ScatterChart from "./Charts/ScatterChart";
import BarChart from "./Charts/BarChart";
import WeatherJSON from "./Charts/my_weather_data.json";

const metricLabelsArray = Object.keys(WeatherJSON[0]);

function App() {
  const [metric, setMetric] = useState("humidity");

  useEffect(() => {
    // <BarChart />;
  }, [metric]);

  const SelectMetric = () => {
    return (
      <div>
        <select
          autoFocus
          name="metric"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}>
          {metricLabelsArray.map((metricLabel) => (
            <option key={metricLabel} value={metricLabel}>
              {metricLabel}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="App">
      {/* <SelectMetric /> */}
      <div className="row">
        <BarChart metric={metric} />
        <ScatterChart />
        <Weather />
        <LineChart height={400} width={400}/>
        <TimeSeries height={400} width={400} />
        <Histogram height={400} width={400} />
      </div>
    </div>
  );
}

export default App;

/* eslint-disable */

import "./App.css";
import LineChart from "./Charts/LineChart";
import TimeSeries from "./Charts/TimeSeries";
import Histogram from "./Charts/Histogram";
import Weather from "./Charts/NYCTemperature2018";
import ScatterChart from "./Charts/ScatterChart";

function App() {
  return (
    <div className="App">
      <div className="row">
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

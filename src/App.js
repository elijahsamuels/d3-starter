import "./App.css";
import LineChart from "./Charts/LineChart";
import TimeSeries from "./Charts/TimeSeries";
import Histogram from "./Charts/Histogram";
import Weather from "./Charts/NYCTemperature2018";

function App() {
  return (
    <div className="App">

      <div className="row">
        <Weather height={400} width={400} />
				
        <LineChart height={400} width={400}/>
        <TimeSeries height={400} width={400} />
        <Histogram height={400} width={400} />

      </div>
    </div>
  );
}

export default App;

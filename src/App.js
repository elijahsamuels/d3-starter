import "./App.css";
import LineChart from "./Charts/LineChart";
import TimeSeries from "./Charts/TimeSeries";
import Histogram from "./Charts/Histogram";

function App() {
  return (
    <div className="App">

      <div className="row">
        <LineChart height={400} width={400}/>
        <TimeSeries height={400} width={400} />
        <Histogram height={400} width={400} />
      </div>
    </div>
  );
}

export default App;

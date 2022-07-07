import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function TimeSeries(props) {
  let csvURL =
    "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv";

  const { width, height } = props;

  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      getURLData();
    }
    // });
  }, [data]);

  const getURLData = async () => {
    let tempData = [];
    await d3.csv(
      csvURL,
      () => {},
      function(d) {
        tempData.push({
          date: d3.timeParse("%Y-%m-%d")(d.date),
          value: parseFloat(d.value),
        });
      }
    );
    setData(tempData);
  };

  const drawChart = () => {
    // add margins so the chart isn't outside the window. Really to keep it easier to read.
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // draw chart area
    const svg = d3
      .select("#time_series")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // d3.extent() returns an array of the min and max values
    var xScaleTime = d3
      .scaleTime()
      .domain( d3.extent(data, function(d) { return d.date; })
        // refactor this
        // d3.extent(data, (d) => d.date)
      )
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScaleTime));

    var yScaleTime = d3
      .scaleLinear()
      .domain([0,d3.max(data, function(d) { return +d.value; }),
			// refactor this
      // .domain([0,d3.max(data, (d) => +d.value),
      ])
      .range([height, 0]);

    svg
      .append("g")
      // .attr("transform", `translate(0, ${height})`)
      .call(d3.axisLeft(yScaleTime));

		// describe the lines path. Where the points/line will go
		const line = d3
			.line()
			.x((d) => xScaleTime(d.date))
			.y((d) => yScaleTime(d.value))
			// .curve(d3.curveMonotoneX);

		svg
			.append("path")
			.datum(data) // datum creates an element for every piece of data from data
			.attr("fill", "none")
			.attr("stroke", "green")
			.attr("stroke-width", 0.5)
			// .attr("class", "line")
			.attr("d", line);
			
  };

  return (
    <div>
      <h2>Time Series Line Chart</h2>
      <h4>using D3.js with valuation of Bitcoin as data</h4>
      <div className="time_series chart" id="time_series"></div>
    </div>
  );
}

export default TimeSeries;

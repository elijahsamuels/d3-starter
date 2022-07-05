import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function LineChart(props) {
  const { width, height } = props;
  const [data, setData] = useState([]);

  // generate random data and set it to the data element
  // ex. [{label: 1, value: 5}, {label:2, value: 10}]
  const generateData = () => {
    const chartData = [];

    for (let i = 0; i < 20; i++) {
      const value = Math.floor(Math.random() * i + 3);
      chartData.push({
        label: i,
        value: value,
        // value,
      });
    }
    setData(chartData);
  };

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      generateData();
    }
  });
  // }, [data]);

  const drawChart = () => {
    // add margins so the chart isn't outside the window. Really to keep it easier to read.
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // establish x and y min and max values
    // .min() and .max() functions loop through the data. d represents each piece of data and returns that value or label.
    // This ultimately sets the chart ranges.
    const xMinValue = d3.min(data, (d) => d.label);
    const xMaxValue = d3.max(data, (d) => d.label);
    const yMinValue = d3.min(data, (d) => d.value);
    const yMaxValue = d3.max(data, (d) => d.value);

    // draw chart area
    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([xMinValue, xMaxValue])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      // .domain([0, 20]);
      .domain([0, yMaxValue]);

    // create x grid
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-height)
          .tickFormat("")
      );

    // create y grid
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat("")
      );

    // create x-axis labels
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom()
          .scale(xScale)
          .tickSize(15)
      );

    // create y-axis labels
    svg
      .append("g")
      .attr("class", "y-axis")
      .call(
        d3
          .axisLeft()
          .scale(yScale)
          .tickSize(15)
      );

    // describe the lines path. Where the points/line will go
    const line = d3
      .line()
      .x((d) => xScale(d.label))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX); // This is optional, and only needed if you want to change the line curvature
      // .curve(d3.curveStep); // curveStepAfter or curveStepBefore
      // .curve(d3.curveNatural); // can lead to extending the line past the actual data point, resulting in misleading line

    svg
      .append("path")
      .datum(data) // datum creates an element for every piece of data from data
      .attr("fill", "none")
      .attr("stroke", "#f6c3d0")
      .attr("stroke-width", 4)
      .attr("class", "line")
      .attr("d", line);
  };

  return (
    <div>
      <h2>LineChart</h2>
      <h4>using D3.js with random data</h4>
      <div className="container chart" id="container"></div>
    </div>
  );
}

export default LineChart;

/* eslint-disable */
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import WeatherJSON from "./my_weather_data.json";

const metricLabelsArray = Object.keys(WeatherJSON[0]);

function BarChart(props) {

	// console.log('props:', props);

  const drawHistorgram = (metricLabel) => {
    // ---- 1. Access Data ----//

    // const xAccessor = (d) => d.humidity;
    const xAccessor = (d) => d[metricLabel];
    const yAccessor = (d) => d.length;

    const [data, setData] = useState([]);

    useEffect(() => {
      if (data.length > 0) {
        barChart();
      } else {
        getData();
      }
    }, [data]);

    const getData = async () => {
      await setData(WeatherJSON);
    };

    const barChart = () => {

      // ---- 2. Create chart dimensions ----//

      const width = 600;
      const dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
          top: 30,
          right: 10,
          bottom: 50,
          left: 50,
        },
      };

      dimensions.boundedWidth =
        dimensions.width - dimensions.margin.left - dimensions.margin.right;
      dimensions.boundedHeight =
        dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

      // ---- 3. Draw SVG (or canvas) ----//

      const wrapper = d3
        .select("#bar-chart")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

      const bounds = wrapper
        .append("g")
        .style(
          "transform",
          `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
        );

      // ---- 4. Create scales ----//

      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice();

      const binGenerator = d3
        .bin()
        .domain(xScale.domain())
        .value(xAccessor)
        .thresholds(12); // .threshold() is basically a smart limiter to the number of bins (bars in this case). 'Smart' in that it keeps the units/numbers in a pleasant range (0.5 to 1.5 instead of .49999 to 1.500001)

      const bins = binGenerator(data);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimensions.boundedHeight, 0])
        .nice();

      // ---- 5. Draw data ----//

      const allBins = bounds.append("g");
      const binGroups = allBins
        .selectAll("g")
        .data(bins)
        .join("g");

      const barPadding = 1;

      const barRects = binGroups
        .append("rect")
        .attr("x", (d) => xScale(d.x0) + barPadding / 2)
        .attr("y", (d) => yScale(yAccessor(d)))
        .attr("width", (d) =>
          d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding])
        )
        .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
        .attr("fill", "skyblue");

      const barText = binGroups
        .filter(yAccessor)
        .append("text")
        .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        .attr("y", (d) => yScale(yAccessor(d)) - 5)
        .text(yAccessor)
        .style("text-anchor", "middle")
        .style("fill", "#444")
        .style("font-family", "sans-serif")
        .style("font-size", "14px");

      // ---- 6. Draw peripherals ----//

      const mean = d3.mean(data, xAccessor);

      const meanLine = bounds
        .append("line")
        .attr("x1", xScale(mean))
        .attr("y1", 0)
        .attr("x2", xScale(mean))
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke", "red")
        .style("stroke-dasharray", "5px 5px");

      const meanLabel = bounds
        .append("text")
        .attr("x", xScale(mean))
        .attr("y", -10)
        .text("Mean")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .attr("fill", "red")
        .style("font-size", "14px");

      const xAxisGenerator = d3.axisBottom().scale(xScale);

      const xAxis = bounds
        .append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`);

      const xAxisLabel = xAxis
        .append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .style("text-anchor", "middle")
        .text(metricLabel)
        .style("fill", "black")
        .style("font-family", "sans-serif")
        .style("font-size", "14px");
    };
  };

  drawHistorgram(props.metric);
  // drawHistorgram("humidity");

  return (
    <div>
      <h2>Bar Chart</h2>
      <h4>using D3.js static JSON data</h4>
      <div className="bar chart" id="bar-chart"></div>
    </div>
  );
}

export default BarChart;

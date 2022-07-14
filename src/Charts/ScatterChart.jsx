/* eslint-disable */
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import WeatherJSON from "./my_weather_data.json";

function ScatterChart() {
  // ---- 1. Access Data ----//

  const xAccessor = (d) => d.dewPoint;
  const yAccessor = (d) => d.humidity;
  const colorAccessor = (d) => d.cloudCover;

  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      getData();
    }
  }, [data]);

  const getData = async () => {
    await setData(WeatherJSON);
  };

  const drawChart = () => {
    // ---- 2. Create chart dimensions ----//

    const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

    let dimensions = {
      width: width,
      height: width,
      margin: {
        top: 10,
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
      .select("#wrapper") // selecting the element by it's ID
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);
    // .style("border", "1px solid");

    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px`
      );

    // ---- 4. Create scales ----//

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, xAccessor)) // the extent of the output domain
      .range([0, dimensions.boundedWidth])
      .nice(); // the .nice() method rounds the values on the axes, making it easier to read the values

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yAccessor)) // the extent of the output domain
      .range([dimensions.boundedHeight, 0])
      .nice(); // the .nice() method rounds the values on the axes, making it easier to read the values

    const colorScale = d3
      .scaleLinear()
      .domain(d3.extent(data, colorAccessor)) // the extent of the output domain
      .range(["skyblue", "darkslategrey"],);
    // ---- 5. Draw data ----//

    // while this works, it's not ideal because there isn't a link between the data and being able to update the data. Instead, use the ,data
    // data.forEach((d) => {
    //   bounds
    //     .append("circle")
    //     .attr("cx", xScale(xAccessor(d)))
    //     .attr("cy", yScale(yAccessor(d)))
    //     .attr("r", 3);
    // });

    // const dots = bounds
    //   .selectAll("circle")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //   .attr("cx", (d) => xScale(xAccessor(d)))
    //   .attr("cy", (d) => yScale(yAccessor(d)))
    //   .attr("r", 3);

    const dots = bounds.selectAll("circle").data(data);

    dots
      .join("circle")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 3)
      // .attr("fill", "red")  // set one color to plot 2 values (x and y)
				.attr("fill", d => colorScale(colorAccessor(d)))

    // ---- 6. Draw peripherals ----//

    const xAxisGenerator = d3.axisBottom().scale(xScale);

    const xAxis = bounds
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`);

    const xAxisLabel = xAxis
      .append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.2rem")
      .html("Dew point (&deg;F) \n Lighter color means less cloud coverage");

    const yAxisGenerator = d3
      .axisLeft()
      .scale(yScale)
      .ticks(4);

    const yAxis = bounds.append("g").call(yAxisGenerator);

    const yAxisLabel = yAxis
      .append("text")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + dimensions.margin.left * 0.35)
      .style("font-size", "1.2rem")
      .style("fill", "black")
      .html("Relative humidity")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle");
  };

  return (
    <div>
      <h2>Scatter Chart</h2>
      <h4>using D3.js static JSON data</h4>
      <div className="wrapper chart" id="wrapper"></div>
    </div>
  );
}

export default ScatterChart;

/* eslint-disable */
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import WeatherJSON from "./my_weather_data.json";

function NYCTemperature2018() {
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => dateParser(d.date);
  const yAccessor = (d) => d.temperatureMax;

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
    console.log(
      "Left this console.log in so you can see the data.",
      "\nData for NYC TemperatureMax 2018:",
      data
    );

    let dimensions = {
      width: window.innerWidth * 0.9,
      height: 400,
      margins: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
      },
    };

    dimensions.boundedWidth =
      dimensions.width - dimensions.margins.left - dimensions.margins.right;
    dimensions.boundedHeight =
      dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

    const wrapper = d3
      .select(".wrapper")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`
      );

    //---- Create Scales ----//

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yAccessor)) // defines input space
      .range([dimensions.boundedHeight, 0]); // defines output space

    // console.log("d3.extent(data, yAccessor):", d3.extent(data, yAccessor));
    // console.log("data:", data);

    const freezingTemperaturePlacement = yScale(32);
    const freezingTemperatures = bounds
      .append("rect")
      .attr("x", 0)
      .attr("width", dimensions.boundedWidth)
      .attr("y", freezingTemperaturePlacement)
      .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
      .attr("fill", "lightblue");

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, xAccessor)) // defines input space
      .range([0, dimensions.boundedWidth]); // defines output space

    //---- Draw Line ----//

    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)));

    // const lineColor = d3
    //   .scaleLinear()
    //   .domain([0, d3.max(data, (d) => d.temperatureMax)])
    //   .range(["blue", "red"]);

    const line = bounds
      .append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", "blue") //---- CHANGE THIS TO THE TEMP ----//
      // .attr("stroke", lineColor(45))
      .attr("stroke-width", 2);

    //---- Draw peripherals (sides and labels) ----//

    const yAxisGenerator = d3.axisLeft().scale(yScale);
    // const yAxis = bounds.append("g")
    // yAxisGenerator(yAxis) // call the function to generate the y-axis and labels

    const yAxis = bounds.append("g").call(yAxisGenerator); // you can use the .call() function to pass in the function. Good because you don't have to break the chain, but odd because we don't ever use "yAxis" variable. If we're not using that variable "yAxis", just write //bounds.append("g").call(yAxisGenerator) and it will still work.

    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = bounds
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`);
  };

  return (
    <div>
      <h2>NYC Max Temperature 2018</h2>
      <h4>using D3.js static JSON data</h4>
      <div className="wrapper chart" id="wrapper"></div>
    </div>
  );
}

export default NYCTemperature2018;

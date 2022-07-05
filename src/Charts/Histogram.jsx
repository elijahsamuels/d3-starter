import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function Histogram(props) {
  const { width, height } = props;

  let jsonURL = "https://api.openbrewerydb.org/breweries";

  const [data, setData] = useState([]);

  // if there's data, then draw the chart. If no data, set it to state.
  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      getURLData();
    }
  }, [data]);

  const getURLData = async () => {
    let urlResponse = await fetch(jsonURL);
    let jsonResult = await urlResponse.json();

    let stateFreq = {};
    jsonResult.forEach((element) => {
      if (stateFreq[element.state] > 0) {
        stateFreq[element.state] = stateFreq[element.state] + 1;
      } else {
        stateFreq[element.state] = 1;
      }
    });
    // console.log('stateFreq:', stateFreq);

    let stateFreqArray = Object.keys(stateFreq).map((key) => {
      return { state: key, frequency: stateFreq[key] };
    });
    // console.log("stateFreqArray:", stateFreqArray);

    setData(stateFreqArray.sort((a, b) => b.frequency - a.frequency));
  };

  const drawChart = () => {
    const margin = { top: 70, right: 70, bottom: 70, left: 70 };
    const border = {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "black",
      borderRadius: "5px",
    };

    const svg = d3
      .select("#histogram")
      .append("svg")
      .style("background-color", "white")
      .style("border-style", border.borderStyle)
      .style("border-width", border.borderWidth)
      .style("border-color", border.borderColor)
      .style("border-radius", border.borderRadius)
      // .style("background-color", "black")
      .attr("width", width)
      .attr("height", height)
      // .attr("box-shadow", "5px 5px 10px #888888")
      .append("g")
      .attr("transform", `translate(0, -${margin.bottom - 10})`);

    // create the x-axis scale: this is scaled based on the states
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.state))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    // create the y-axis: from 0 to max (number of state.frequency)
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency)])
      .range([height - margin.bottom, margin.top]);

    // add colors to the bars based on the state.frequency number and blend the colors
    const barColors = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency)])
      .range(["blue", "red"]);

    // add the x-axis labels to the bottom.
    // select all text elements and rotate -65 degrees
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-65)");

			// add the y-axis labels to the left.
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    const bars = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.state))
      .attr("y", d => yScale(d.frequency))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.frequency))
			// .style("padding", "3px")
			// .style("margin", "1px")
			.style("width", d => `${d * 10}px`) // what part of "d" are we multiplying by 10???
      .attr("fill", d => barColors(d.frequency))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
  };

  return (
    <div>
      <h2>Histogram</h2>
      <h4>using D3.js with <a href="https://api.openbrewerydb.org/breweries">breweries as data</a></h4>
      <div className="histogram chart" id="histogram"></div>
    </div>
  );
}

export default Histogram;

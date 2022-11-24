// create the svg area
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", 500)
    .attr("height", 500)
  .append("g")
    .attr("transform", "translate(250,250)")

// create a matrix
const matrix = [
  [11975,  5871, 8916, 2868],
  [ 1951, 10048, 2060, 6171],
  [ 8010, 16145, 8090, 8045],
  [ 1013,   990,  940, 6907]
];
const names = ["A", "B", "C", "D"]
const colors = ["#440154ff", "#31668dff", "#37b578ff", "#fde725ff"]

// give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
const res = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending)
    (matrix)

// add the groups on the inner part of the circle
svg
  .datum(res)
  .append("g")
  .selectAll("g")
  .data(function(d) { return d.groups; })
  .join("g")
  .append("path")
    .style("fill", (d,i) => colors[i])
    .style("stroke", "black")
    .attr("d", d3.arc()
      .innerRadius(230)
      .outerRadius(240)
    )

// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
// Its opacity is set to 0: we don't see it by default.
const tooltip = d3.select("#my_dataviz")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
const showTooltip = function(event, d) {
  tooltip
    .style("opacity", 1)
    .html("Source: " + names[d.source.index] + "<br>Target: " + names[d.target.index])
    .style("left", (event.x)/2+300 + "px")
    .style("top", (event.y)/2+500 + "px")
}

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var hideTooltip = function(event, d) {
  tooltip
    .transition()
    //.duration(1000)
    .style("opacity", 0)
}

// Add the links between groups
svg
  .datum(res)
  .append("g")
  .selectAll("path")
  .data(d => d)
  .join("path")
    .attr("d", d3.ribbon()
      .radius(220)
    )
    .style("fill", d => colors[d.source.index])
    .style("stroke", "black")
  .on("mouseover", showTooltip )
  .on("mouseleave", hideTooltip )
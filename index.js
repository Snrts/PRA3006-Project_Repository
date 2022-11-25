// Set-Up
const margin = {left:90, top:90, right:90, bottom:90},
    width =  1000 - margin.left - margin.right, // more flexibility: Math.min(window.innerWidth, 1000)
    height =  1000 - margin.top - margin.bottom, // same: Math.min(window.innerWidth, 1000)
    innerRadius = Math.min(width, height) * .39,
    outerRadius = innerRadius * 1.1;

const names = ["Medication1", "Medication2", "Medication3", "Medication4"],
      colors = ["#440154ff", "#31668dff", "#37b578ff", "#fde725ff"],
      opacityDefault = 0.8

const matrix = [
  [0, 1, 1, 1],
  [1, 0, 1, 1],
  [1, 1, 0, 1],
  [1, 1, 0, 1]
];

//Create scale and layout functions
const color = d3.scaleOrdinal()
    .domain(d3.range(names.length))
    .range(colors);

const chord =  d3.chord()
    .padAngle(0.15)
    .sortSubgroups(d3.descending)

const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

const ribbon = d3.ribbon()
    .radius(innerRadius)

const tooltip = d3.select("#chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

//Create SVG
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
  .datum(chord(matrix));

//Draw outer arcs
const outerArcs = svg.selectAll("g.group")
  .data(function(chords) { return chords.groups; })
  .enter().append("g")
  .attr("class", "group")
  //.on("mouseover", fade(.1))
  //.on("mouseout", fade(opacityDefault))

  // text popups
  //.on("click", mouseoverChord)
  //.on("mouseout", mouseoutChord);

outerArcs.append("path")
  .style("fill", function(d) { return color(d.index); })
  .attr("d", arc);

//Append names
outerArcs.append("text")
  .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
  .attr("dy", ".35em")
  .attr("class", "titles")
  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
  .attr("transform", function(d) {
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
    + "translate(" + (outerRadius + 10) + ")"
    + (d.angle > Math.PI ? "rotate(180)" : "");
  })
  .text(function(d,i) { return names[i]; });

  //Draw inner chords
  svg.selectAll("path.chord")
    .data(function(chords) { return chords; })
    .enter().append("path")
    .attr("class", "chord")
    .style("fill", function(d) { return color(d.source.index); })
    .style("opacity", opacityDefault)
    .attr("d", ribbon)

    //The Mouseover event
    .on('mouseover', function (event, d, i) {
      //Make a new tooltip appear on hover
      tooltip.transition()
        .duration(50)
        .style("opacity", 1);
  
      //Puting text into the tooltip
      tooltip
      .html("Source: " + names[d.source.index] + "<br>Target: " + names[d.target.index])
      .style("left", (event.x)/2+300 + "px")
      .style("top", (event.y)/2+500 + "px")
    })

//////////////////////////////////////////////////////Exxxxxxxtra Functions////////////////////////////////////////////////////
//Returns an event handler for fading a given path.
function fade(opacity) {
  return function(g, i) {
    svg.selectAll("path.chord")
        .filter(function(d) { 
          return d.source.index != i && d.target.index != i; 
        })
    .transition()
        .style("opacity", opacity);
  };
}//fade








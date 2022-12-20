/////////////////////////////////////////////////////////////////////// Set-Up //////////////////////////////////////////////////////////
const margin = {left:90, top:90, right:90, bottom:90},
    width =  1000 - margin.left - margin.right, // more flexibility: Math.min(window.innerWidth, 1000)
    height =  1000 - margin.top - margin.bottom, // same: Math.min(window.innerWidth, 1000)
    innerRadius = Math.min(width, height) * .39,
    outerRadius = innerRadius * 1.1;

const names = ["Medication1", "Medication2", "Medication3", "Medication4"],
      colors = ["#440154ff", "#31668dff", "#37b578ff", "#fde725ff"],
      diseases = ["Disease1", "Disease2"],
      opacityDefault = 0.8

const matrix = [
  [0, 1, 1, 1],
  [1, 0, 1, 1],
  [1, 1, 0, 1],
  [1, 1, 0, 1]
];

////////////////////////////////////////////////// Create scale and layout functions ///////////////////////////////////////////////////
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
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

////////////////////////////////////////////////////////////////// Create SVG /////////////////////////////////////////////////////////
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
  .datum(chord(matrix));

/////////////////////////////////////////////////////////////// Draw inner arcs ///////////////////////////////////////////////////////
const innerArcs = svg.selectAll("g.group")
  .data(function(arcs) { return arcs.groups; })
  .enter().append("g")
  .attr("class", "group")

innerArcs.append("path")
  .style("fill", function(d) { return color(d.index); })
  .attr("d", arc);

///////////////////////////////////////////////////////////////Draw outer arcs /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////Have no clue yet how to make this /////////////////////////////////////////////////
/*const groups = [
  {sIndex: 0, eIndex: 2, title: 'SuperCategory 1', color: '#c69c6d'}
  
];
const cD = chord(matrix).groups;
  
 console.log(cD);

for(const i=0;i<groups.length;i++) {
  const __g = groups[i];  
  console.log(cD[__g.sIndex].startAngle);
  const arc1 = d3.arc()
  // Add to Radii to move arc flush against inner arc
    .innerRadius(innerRadius + 20)
    .outerRadius(outerRadius + 20)
    .startAngle(cD[__g.sIndex].startAngle) 
    .endAngle(cD[__g.eIndex].endAngle) 

// add the translation
  svg.append("path").attr("d", arc1).attr('fill', __g.color).attr('id', 'SuperCategory' + i).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  // Add a text label.
  const text = svg.append("text")
    .attr("x", 200)
    .attr("dy", 20);

  text.append("textPath")
    .attr("stroke","#fff")
    .attr('fill', '#fff')
    .attr("xlink:href","#groupId" + i)
    .text(__g.title);
} **/
/////////////////////////////////////////////////////////////// Append names ///////////////////////////////////////////////////////////
innerArcs.append("text")
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

  //////////////////////////////////////////////////////////// Draw inner chords //////////////////////////////////////////////////////
  svg.append("g")
    .attr("class", "chord")
    .selectAll("path")
    .data(function(chords) { return chords; })
    .enter().append("path")
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

      return svg.selectAll("g.chord path")
        .filter(function(cd) {                   
          return cd.source.index != d.source.index || cd.target.index != d.target.index;
        })
        .transition()
        .style("opacity", 0.1);
      
    })

    //The mouseout event
    .on('mouseout', function () {
      return svg.selectAll("g.chord path")
        .transition()
        .style("opacity", opacityDefault);
      
    })

//////////////////////////////////////////////////////Exxxxxxxtra Functions////////////////////////////////////////////////////











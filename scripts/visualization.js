function dataVisualization(data, matrix) {
  $("#chart").empty() //clears chart area before displaying the 
  /* __________________________________________Set-Up_____________________________________________________________________________________*/
    
  const names = data.map(x => x.medicationName) //create an array containing the names
  const colors = []
  const interactionMatrix = matrix
     
  const opacityDefault = 0.8
  const margin = { left: 150, top: 150, right: 150, bottom: 150 },
    width = 1000,
    height = 1000,
    innerRadius = Math.min(width, height) * .30,
    outerRadius = innerRadius * 1.1;
    
  //randomly generate colors for every interactive medication
  for (var i = 0, l = data.length; i < l; i++) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    colors.push('#' + randomColor)
  }
    
  /* __________________________________________Create scale and loyaut functions_____________________________________________________________________________________--
  */
  //variable ideas taken from: https://stackoverflow.com/questions/43259039/how-to-add-labels-into-the-arc-of-a-chord-diagram-in-d3-js
  //tooltip variable idea taken from: https://d3-graph-gallery.com/graph/chord_interactive.html
  const chord = d3.chord()
    .padAngle(0.01)
    .sortSubgroups(d3.descending)
// creating a scale of colors which we can use to assign colors to each arc
  const color = d3.scaleOrdinal()
    .domain(d3.range(names.length))
    .range(colors)
// creating an arc svg element
  const arc = d3.arc()
    .innerRadius(innerRadius + 80)
    .outerRadius(outerRadius + 75)
 // creating a ribbon svg element       
  const ribbon = d3.ribbon()
    .radius(innerRadius + 75)
// creating a div element which we will use as a tool tip 
// to display the names of the medication later
  const tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip")
    .style("padding", "10px")
    .style("opacity", "0") //we make the opacity 0 now, later we will use a function 
  // to increase the opacity when some ribbon is hovered over

  /* __________________________________________Create SVG Area_____________________________________________________________________________________--
  */
  //visualization idea taken from: https://stackoverflow.com/questions/43259039/how-to-add-labels-into-the-arc-of-a-chord-diagram-in-d3-js
  // setting up the "canvas"
  const svg = d3.select("#chart") //refers to the div with the id "chart"
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")")
    .datum(chord(interactionMatrix));
  /* __________________________________________Draw inner arcs_____________________________________________________________________________________--
  */
  //visualization idea taken from: https://stackoverflow.com/questions/43259039/how-to-add-labels-into-the-arc-of-a-chord-diagram-in-d3-js
    
  //Make a group for every "groups" dataset
  const innerArcs = svg.selectAll("g.group") //select all elements with the class group
    .data(function (chords) { return chords.groups; })
    .enter().append("g")
    // .attr("class", "inner")

  //Visualize arcs using "path"
  innerArcs.append("path")
    .style("fill", function (d) { return color(d.index); })
    .attr("d", arc);// attribute of the svg element path

  //Append names
  innerArcs.append("text")
    .each(function (d) {
      d.angle = (d.startAngle + d.endAngle) / 2;
    })
    .attr("dy", ".35em")
    .attr("class", "titles")
    .attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; }) 
    .attr("transform", function (d) {
      return "rotate(" + (d.angle * (180 / Math.PI) - 90) + ")"
        + "translate(" + (outerRadius + 80) + ")"
        + (d.angle > Math.PI ? "rotate(180)" : "");
    })
    .text(function (d, i) { return names[i]; });

  /* __________________________________________Draw outer arcs_____________________________________________________________________________________--
  */
  //visualization idea taken from: https://stackoverflow.com/questions/47877075/d3js-chord-diagram-multiple-groups
  //idea for hidden arc taken from: https://www.visualcinnamon.com/2015/09/placing-text-on-arcs/

  //make a list of disease names and medication groups
  const groups = d3.groups(data, d => d.diseaseName) //Grouping together the medications that treat the same disease
  console.log(groups)
  const chordData = chord(interactionMatrix).groups          
  for (var i = 0; i < groups.length; i++) {
  /*every start and end index represent the indexes of first and last medication for every disease arc*/
  // we find the first and last occurance of a disease name in the data array 
    const sIndex = data.map(x => x.medicationName).indexOf((groups[i])[1][0].medicationName) // - ?
    const eIndex = data.map(x => x.medicationName).indexOf((groups[i])[1][(groups[i][1].length) - 1].medicationName) // - ?

    //Parameters for an outer arc 
    var outerArc = d3.arc()
      .innerRadius(innerRadius + 250)
      .outerRadius(outerRadius + 150)
      .startAngle(chordData[sIndex].startAngle)
      .endAngle(chordData[eIndex].endAngle)
    
    //Parameters for an invisible arc which we use to place the disease names
    var invisibleArc = d3.arc()
      .innerRadius(innerRadius + 260)
      .outerRadius(outerRadius + 240)
      .startAngle(chordData[sIndex].startAngle)
      .endAngle(chordData[eIndex].endAngle);
    
    //Drawing outer arc
    svg.append("path")
      .style('fill', colors[eIndex])
      .style("opacity", "50%")
      .attr("class", "superGroup")
      .attr("id", `outerGroup${i}`) // - ?
      .attr("d", outerArc);

    /*Drawing and invisible arc above the outer arc
    so the text is floating abouve it **/
    svg.append("path")
      .style("fill", "none")
      .attr("class", "hiddenDonutArcs")
      .attr("id", "hiddenArc" + i)
      .attr("d", invisibleArc);
        
    //Added text labels
    svg.append("text")
      .attr("class", "superGroupText")
      
      .append("textPath")
      .attr("xlink:href", "#hiddenArc" + i)
      .attr("text-anchor", "start")
      // .attr("text-anchor", function)
      .attr("startOffset", "50%")
      .text(groups[i][0])
      .attr("class", "text-2xl font-bold")
      // .style("overflow", "auto")
      // .attr("overflow", "auto")
      // .style("transform", "rotate(20deg)")
      
      .attr("transform", function () {
        angle = (chordData[sIndex].startAngle + chordData[sIndex].endAngle) / 2
        return "rotate(" + (angle * (180 / Math.PI) - 90) + ")"
          + "translate(" + (outerRadius + 80) + ")"
          + (angle > Math.PI ? "rotate(180)" : "");
      })
      .attr("text-anchor", function () { return angle > Math.PI ? "end" : null; }) 
  };
              
  /* __________________________________________Draw inner chords_____________________________________________________________________________________--
  */
  //visualization idea taken from: https://stackoverflow.com/questions/43259039/how-to-add-labels-into-the-arc-of-a-chord-diagram-in-d3-js
  //tooltip animation idea taken from: https://medium.com/@kj_schmidt/show-data-on-mouse-over-with-d3-js-3bf598ff8fc2

  svg.append("g")
    .attr("class", "chords")
    .selectAll("path")
    .data(function (chords) { return chords; })
    .enter().append("path")
    .style("fill", function (d) { return color(d.source.index); })
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
        .style("background-color", colors[d.source.index])
        .style("border-radius", "10px")
        //removed the styles as they were not really needed
        //added a nice transition that would "fade in" the text
                  
        .transition()
        .duration(400)
        .style("font-size", "20px")
        .style()
        .style("position","absolute" );
          
      return svg.selectAll("g.chords path")
        .filter(function (chordData) {
          return chordData.source.index != d.source.index || chordData.target.index != d.target.index;
        })
        .transition()
        .style("opacity", 0.1);
          
    })     
    //The mouseout event
    .on('mouseout', function () {
      //added a nice transition that would "fade out" the text
      tooltip
        .transition()
        .duration(400)
        .style("opacity", "0")

      return svg.selectAll("g.chords path")
        .transition()
        .style("opacity", opacityDefault);
                
    });
          
  //////////////////////////////////////////////////////Exxxxxxxtra Functions////////////////////////////////////////////////////
          
}
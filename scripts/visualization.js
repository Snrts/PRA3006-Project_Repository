function dataVisualization(data, matrix) {
    $("#chart").empty() //clears chart area before displaying the 
/* __________________________________________Set-Up_____________________________________________________________________________________--

*/
    
    const names = data.map(x => x.medicationName)
    const colors = []
    const interactions = matrix
    const groups = d3.groups(data, d => d.diseaseName) 
     
  
    const opacityDefault = 0.8
    const margin = { left: 90, top: 90, right: 90, bottom: 90 },
     width = 1000 - margin.left - margin.right // more flexibility: Math.min(window.innerWidth, 1000),
     height = 1000 - margin.top - margin.bottom // same: Math.min(window.innerWidth, 1000),
     innerRadius = Math.min(width, height) * .39,
     outerRadius = innerRadius * 1.1;
    
  for (var j = 0; j < data.length; j++){
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
            colors.push('#' + randomColor)
  }
    
 /* __________________________________________Math_____________________________________________________________________________________--
*/
    //Create scale and layout functions
    const color = d3.scaleOrdinal()
        .domain(d3.range(groups.length))
        .range(colors);
/* __________________________________________Elements_____________________________________________________________________________________--
*/
    const chord = d3.chord()
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

/* __________________________________________create SVG_____________________________________________________________________________________--
*/
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")")
    .datum(chord(interactions));
  
  
/* __________________________________________Outer arcs_____________________________________________________________________________________--
*/    
    //Draw outer arcs
    const innerArcs = svg.selectAll("g.group")
        .data(function(arcs) { return arcs.groups; })
        .enter().append("g")
    .attr("class", "group")
  

    innerArcs.append("path")
        .style("fill", function(d) { return color(d.index); })
        .attr("d", arc);// attribute of the svg element path

    //Append names
    innerArcs.append("text")
        .each(function (d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .attr("class", "titles")
        .attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function (d) {
            return "rotate(" + (d.angle * (180 / Math.PI)-90) + ")"
                + "translate(" + (outerRadius + 10) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function (d, i) { return names[i]; })

        // const groups = d3.groups(data, d => d.diseaseName) 
        const chordData = chord(interactions).groups
            
        
          
    for (var i = 0; i < groups.length; i++) {
      const sIndex = data.map(x => x.medicationName).indexOf((groups[i])[1][0].medicationName)
      const eIndex = data.map(x => x.medicationName).indexOf((groups[i])[1][(groups[i][1].length)-1].medicationName)
        
            var diseaseGroup = groups[i]
            var outerArc = d3.arc()
            // Add to Radii to move arc flush against inner arc
              .innerRadius(innerRadius + 160)
              .outerRadius(outerRadius + 100)
              .startAngle(chordData[sIndex].startAngle) 
            .endAngle(chordData[eIndex].endAngle)
            
        
          
              svg.append("path")
              .style('fill', colors[i])
                  .attr("class", "superGroup")
                  .style("opacity", "50%")
              .attr("id", `outerGroup${i}`) //add id here ????????????
              .attr("d", outerArc);
          
            // Add a text labels
             /*svg.selectAll(".superGroupText")
                .enter().append("text")
                .attr("class", "superGroupText")
                .appen("textPath")
                .attr("xlink:href", "#outerGroup" + i)
                .text("some text"); **/
          
          //working!!!!
              svg.append("text")
                .attr("class", "superGroupText")
                .append("textPath")
                  .attr("href", "#outerGroup" + i)
            .text(groups[i][1][0].diseaseName)
            .attr("class", "text-2xl font-bold")
          } 
          
          /*svg.selectAll(".superGroupText")
            .data(groups)
            .enter().append("text")
            .attr("class", "superGroupText")
            .append("textPath")
            .attr("href", "#outerGroup" + function(d,i){return "#outerGroup"+d.index;})
            .text("some text"); **/
          
          
            //////////////////////////////////////////////////////////// Draw inner chords //////////////////////////////////////////////////////
            svg.append("g")
              .attr("class", "chord")
              .selectAll("path")
              .data(function(chords) { return chords; })
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
                  .style("left", (event.x)/2+300 + "px")
                  .style("top", (event.y)/2+500 + "px")
          
                return svg.selectAll("g.chord path")
                  .filter(function(chordData) {                   
                    return chordData.source.index != d.source.index || chordData.target.index != d.target.index;
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
  
/////////////////////////////////////////////////////Exxxxxxxtra Functions////////////////////////////////////////////////////
          
          
          
          
          
          
          
          
          
          
          



        /* __________________________________________Elements_____________________________________________________________________________________--

    //Draw inner chords
    svg.selectAll("path.chord")
        .data(function (chords) { return chords; })
        .enter().append("path")
        .attr("class", "chord")
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
                .style("left", (event.x) / 2 + 300 + "px")
                .style("top", (event.y) / 2 + 500 + "px")
        })
*/
} 
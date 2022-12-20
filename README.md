# Project_Repo
## Authors
Sanne Aarts - @Snrts  <br>
Aleksandrs Handramaj - @ahandramaj <br>
Veronique Hehl - @stuurtjevero <br>

## The Project
### Aim
This Repository contains the code for the psychiatric medication checker that was built during the PRA3006: Programming in the Life Sciences course of the academic year 2022-2023. 

The Tool aims to show how different webservices can be combined to provide an accessible resource which may help patients suffering from simultaneous mental disorders check the interactions  and potentially the overlap between the medications used as treatment. This tool does not claim to replace any professional medical advice, simply to show the potential for the usage of tools such as this. 
### The Webservices 
<ul>
<li><b>Wikidata</b><br>
         <a href="https://www.wikidata.org">Wikidata</a> is a central data storage which can be accessed through the SPARQL endpoint. <br> 
        <i>We found that for our specific goal, wikidata allowed us to combine information from many different, otherwise unrelated sources which allowed us to not only find the data we needed but also combine it and discover the relationship between them. </i></li>
<li><b>SPARQL</b><br>
         <a href="https://www.w3.org/TR/sparql11-query/">SPARQL</a>is a query language for RDF (Resourse Descriptive Framework), in which data is stored in a labeled, directed graph.   <br> 
        <i>We found that whilst SPARQL is easy and straightforward to get started with, it becomes more powerful as the queries become more complex. Since we had to consider and compare numerous layers of relationships, we benefitted greatly when using SPARQL to extract data. </i></li>
<li><b>D3.js</b><br>
         <a href="https://d3js.org/">D3.js</a> Is a Javascript Library that assists in binding data to the DOM (Document Object Model) and in doing so is a powerful data visualization framework <br> 
        <i>In order to create the diagram we chose to create in d3.js, the data had to be provided in a very specific way, namely a matrix. Working withh a standardized framework meant that we knew exactly what we were in for and whilst it took some time to figure out how to modify the data in the necessary way, it meant that we knew exactly what we were in for.</i></li>
<li><b>jQUERY</b><br>
         <a href="https://jquery.com/">jQuery</a> is another Javascript library though with its usage more oriented towards event handling and responsivenes<br> 
        <i>In our project we only made use of this framework every so often, it greatly simplified common tasks which are often taken for granted.</i></li>
<li><b>Tailwindcss</b><br>
         <a href="https://tailwindcss.com/">Tailwindcss</a> is a css framework that greatly simplifies the design aspect<br> 
        <i>Due to the short duration of the course, we had to choose functionality over design, by using Tailwindcss we were still able to work on user experience without taking away from the time spent on the functionality. Since all of the styling is done right in the html file, there are no css files cluttering up our project, furthermore, it made the project much easier to maintain when working in a group. </i></li>
</ul>

## Files included in this repository 

/*______________________________________________________________________________________________________________________________________________
*/
async function loadDropdown() {
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // on pageload, the diseases are fetched, for each disease an <option> is created and added to the 
  // selection element 
  const dropdown = document.getElementById("dropdown");   //tells javascript that whenever we refer to "dropdown"
                                                          // we are refering to the html element with the id "dropdown"
    const diseases = await diseasesQuery();               //fetches the diseases by running the function from the queries.js
    for (var i = 0, l = diseases.length; i < l; i++) {    //for each element in the list
      const option = document.createElement("option"); 
                                                          // a new 'option' is created in the dropdown 
      option.text = diseases[i].diseaseLabel.value;       // attaches the name of the disease to the option
      option.label = diseases[i].diseaseLabel.value;
      option.value = diseases[i].disease.value;           //attaches the wikidata code to the option so it can
                                                          //be passed on later
      option.classList.add();
      dropdown.add(option); // adds newly created option to the <select> </select> element in the html
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // function to alphabetically sort the diseases in the selection menu with the id "dropdown" by changing the indices
  $(function () {
      var select = $("#dropdown"); 
      select.html(
        select.find("option").sort(function (x, y) {
          return $(x).text() > $(y).text() ? 1 : -1;
        })
      );
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loadDropdown(); // calls the function above when the page is loaded
/*______________________________________________________________________________________________________________________________________________*/
   $("#submit").on("click", function () {
    $("#chart").empty();
    const loader = document.createElement("div");
    loader.classList.add(
      "border-t-blue-600",
      "rounded-full",
      "h-24",
      "w-24",
      "m-auto",
      "border-t-8",
      "border-8",
      "animate-spin"
    );
    const text = document.createElement("div");
    text.classList.add("mx-auto", "w-fit", "mt-2");
    text.innerHTML = "loading....";
  
    $("#chart").append(loader);
    $("#chart").append(text);
  });
/*______________________________________________________________________________________________________________________________________________*/  
  
  
/*________________________________________________________________________________________________________________________________________________________*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// when the submit button on the form is clicked this function is initiated
$("#submit").on("click", async function () {                    //adds event listener in the button in the html file with the id "submit"
    $("#dropdown").attr("size", "5");
    $("#diseaseList").empty();                                  // clears the list element before running the rest of the function (in case the function is ran multiple times)
    $("#div").empty();                                          //clears the div before running the rest of the function
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    var diseasesSelected = [];                                  // clears the list before (in case the function is ran multiple times, which would otherwise cause accumulation)
    var diseasesSelected = $("select option:selected");         // assigns all the selected options to the variable diseasesSelected
    var diseaseList = [];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
// displays all the diseases and medication sorted by which of the selected diseases it treats, regardless of whether it has any interactions
    for (var i = 0, l = diseasesSelected.length; i < l; i++) {  // loops through all elements of the diseasesSelected list
      const disease = document.createElement("li");             //creates a list item for each of the diseases selected by the user
            disease.classList.add("w-full");
            disease.innerHTML = diseasesSelected[i].label;      // allows us to display the name of the disease
      $("#diseaseList").prepend(disease);                       // adds the disease item to the diseasesList element
      const diseaseData = await fetchMeds(diseasesSelected[i]); // passes on the selected diseases and initiates the query to fetch and display their medicines
    diseaseList.push(diseaseData);                           
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fetchInteractions(diseaseList);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*________________________________________________________________________________________________________________________________________________________*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function fetchMeds(selection) {
    const listElement = document.createElement("ul"); //creates an element "unordered list"
        listElement.classList.add("list-disc", "grid", "grid-cols-2", "ml-5"); // uses tailwind to add the bulletpoints to the list
    const container = document.createElement("div"); // creates a "div" element
            container.innerHTML = selection.label; // adds the text corresponding to the selected medication
            container.append(listElement); // adds the unordered list to the container
            container.classList.add("my-2", "font-bold", "text-xl"); //uses tailwind to add a 2 pt y margin to the container and make the text bold
    const diseaseCode = selection.value.slice(31); // leaves only the wikidata code of that object
    const outputMedicationQuery = await medicationQuery(diseaseCode);
    for (var j = 0, m = outputMedicationQuery.length; j < m; j++) {
            const link = document.createElement("a");
                    link.innerHTML = outputMedicationQuery[j].medicineLabel.value; //adds text to the list item matching the name of the medicine
                    link.href = outputMedicationQuery[j].medicine.value;
                    link.classList.add("font-light", "underline", "text-base"); // uses tailwind to make the font of the list items bbe light
            const listItem = document.createElement("li"); // creates a new element "list item"
                    listItem.append(link);
                    listElement.append(listItem); //adds the list item to the list
    }
    $("#div").append(container);
    return [diseaseCode, selection.label] //adds the code and name of the disease 
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*______________________________________________________________________________________________________________________________________________*/
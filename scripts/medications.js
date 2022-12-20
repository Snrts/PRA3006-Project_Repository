/*________________________________________________________________________________________________________________________________________________________*/
$("#submit").on("click", async function () {
    //adds event listener in the button in the html file with the id "submit"
    $("#dropdown").attr("size", "5");
    var diseasesSelected = []; //clears the list before (in case the function is ran multiple times)
    var diseasesSelected = $("select option:selected"); // assigns all the selected options to the variable selection
    var diseaseList = [];
    $("#diseaseList").empty(); // clears the list element before running the rest of the function (in case the function is ran multiple times)
    $("#div").empty(); //clears the div before running the rest of the function
    for (var i = 0, l = diseasesSelected.length; i < l; i++) {
      // loops through all elements of the selection list
      const disease = document.createElement("li"); //creates a list item for each of the diseases selected by the user
      disease.classList.add("w-full");
      disease.innerHTML = diseasesSelected[i].label; //allows us to display the name of the disease
      $("#diseaseList").prepend(disease); // adds the list element to the list
      const diseaseData = await fetchMeds(diseasesSelected[i]); // passes on the selected diseases and initiates the query to fetch their medicines
        diseaseList.push(diseaseData);
    }
    fetchInteractions(diseaseList);
});
/*________________________________________________________________________________________________________________________________________________________*/
  async function fetchMeds(selection) {
    const listElement = document.createElement("ul"); //creates an element "unordered list"
    listElement.classList.add("list-disc", "grid", "grid-cols-2", "ml-5"); // uses tailwind to add the bulletpoints to the list
    const container = document.createElement("div"); // creates a "div" element
    container.innerHTML = selection.label; // adds the text corresponding to the selected medication
    container.append(listElement); // adds the unordered list to the container
    container.classList.add("my-2", "font-bold", "text-xl"); //uses tailwind to add a 2 pt y margin to the container and make the text bold
  
    const diseaseCode = selection.value.slice(31); // leaves only the wikidata code of that object
    const outputMedicationQuery = await medicationQuery(diseaseCode);
  
     //clears out the list of medication before the function is ran (incase is is ran multiple times)
    for (var j = 0, m = outputMedicationQuery.length; j < m; j++) {
            const listItem = document.createElement("li"); // creates a new element "list item"
            const link = document.createElement("a");
            link.innerHTML = outputMedicationQuery[j].medicineLabel.value; //adds text to the list item matching the name of the medicine
            link.href = outputMedicationQuery[j].medicine.value;
            link.classList.add("font-light", "underline", "text-base"); // uses tailwind to make the font of the list items bbe light
            listItem.append(link);
            listElement.append(listItem); //adds the list item to the list
    }
    $("#div").append(container);
    return [diseaseCode, selection.label] //adds the code and name of a disease and all the medications that treat it
}
/*______________________________________________________________________________________________________________________________________________*/
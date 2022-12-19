async function loadDropdown() {
    const dropdown = document.getElementById("dropdown") //tells javascript that whenever we refer to "dropdown"
    // we are refering to the html element with the id "dropdown"
    const diseases = await diseasesQuery() //fetches the diseases by running the function from the queries.js
    for (var i = 0, l = diseases.length; i < l; i++) {
        const option = document.createElement('option') //for each element in the list
        // a new 'option' is created in the form
        option.text = diseases[i].diseaseLabel.value; // attaches the name of the disease to the option
        option.label = diseases[i].diseaseLabel.value;
        option.value = diseases[i].disease.value; //attaches the wikidata code to the option so it can
        //be passed on later
        option.classList.add()
        dropdown.add(option) // adds newly created option to the <select> </select> element in the html
    }
    $(function ()
    { // function to alphabetically sort the diseases
        var select = $('#dropdown'); //selects the element with the id reading "dropdown"
        select.html(select.find('option') 
            .sort(function (x, y) {
                return $(x).text()
                    > $(y).text() ? 1 : -1;
            }))
    }
    )
}
loadDropdown() // initiates function above
//________________________________________________________________________________________________//
    $("#submit").on("click", async function () { //adds event listener in the button in the html file with the id "submit"
        $("#dropdown").attr("size", '5')
        var diseasesSelected = [] //clears the list before (in case the function is ran multiple times)
        var diseasesSelected = $("select option:selected") // assigns all the selected options to the variable selection
        var allMeds = []
        $('#diseaseList').empty() // clears the list element before running the rest of the function (in case the function is ran multiple times)
        $('#div').empty()//clears the div before running the rest of the function
        for (var i = 0, l = diseasesSelected.length; i < l; i++) { // loops through all elements of the selection list
            const disease = document.createElement('li') //creates a list item for each of the diseases selected by the user
                    disease.classList.add("w-full")
                    disease.innerHTML = diseasesSelected[i].label //allows us to display the name of the disease
            $('#diseaseList').prepend(disease) // adds the list element to the list
            const meds = await fetchMeds(diseasesSelected[i])// passes on the selected diseases and initiates the query to fetch their medicines
            allMeds.push(meds)
        }
        console.table(allMeds)
    fetchInteractions(allMeds)
    })
//_________________________________________________________________________________________________________________________//    
$("#submit").on("click",
function(){
    $("#chart").empty()
    const loader = document.createElement("div")
            loader.classList.add("border-t-blue-600","rounded-full", "h-24","w-24","m-auto","border-t-8", "border-8", "animate-spin")
    const text = document.createElement("div")
            text.classList.add("mx-auto", "w-fit",  "mt-2")
            text.innerHTML = "loading...."
    
    $("#chart").append(loader)
    $("#chart").append(text)
})
//_______________________________________________________________________________________________________________//

async function fetchMeds(selection) {
    
    const listElement = document.createElement('ul'); //creates an element "unordered list"
            listElement.classList.add("list-disc") // uses tailwind to add the bulletpoints to the list
    const container = document.createElement('div') // creates a "div" element
            container.innerHTML = selection.label // adds the text corresponding to the selected medication 
            container.append(listElement) // adds the unordered list to the container
            container.classList.add("my-2", "font-bold") //uses tailwind to add a 2 pt y margin to the container and make the text bold
            
    const diseaseCode = selection.value.slice(31) // leaves only the wikidata code of that object     
    const outputMedicationQuery = await medicationQuery(diseaseCode)
            
    var medication = [] //clears out the list of medication before the function is ran (incase is is ran multiple times)
    var medicationList = []

    for (var j = 0, m = outputMedicationQuery.length; j < m; j++)
    {
        medicationList.push([outputMedicationQuery[j].medicine.value.slice(31), outputMedicationQuery[j].medicineLabel.value]) //adds the medication to the list, once again the slice makes sure we only get the item code
        
        const listItem = document.createElement('li') // creates a new element "list item"
        const link = document.createElement("a")
        link.innerHTML = outputMedicationQuery[j].medicineLabel.value //adds text to the list item matching the name of the medicine
        link.href = outputMedicationQuery[j].medicine.value
        link.classList.add("font-light", "underline","ml-5" ) // uses tailwind to make the font of the list items bbe light
              
        listItem.append(link)        
        listElement.append(listItem) //adds the list item to the list 
    }
    $('#div').append(container)
    
    medication.push([diseaseCode, selection.label, medicationList]) //adds the code and name of a disease and all the medications that treat it
    return medication
}


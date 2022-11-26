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
        var selection = [] //clears the list before (in case the function is ran multiple times)
        var selection = $("select option:selected") // assigns all the selected options to the variable selection
        var disandmeds = []
        $('#diseaseList').empty() // clears the list element before running the rest of the function (in case the function is ran multiple times)
        $('#div').empty()
        for (var i = 0, l = selection.length; i < l; i++) { // loops through all elements of the selection list
            const button = document.createElement('button') //creates a button element for each of the selected diseases
            button.innerHTML = "&times" // adds a cross 
            button.value = selection[i].value.slice(31) //assigns the disease id to the button so that it can be
            // we can use it to filter the selection and remove a choice
            button.classList.add("float-right")

            const item = document.createElement('li') //creates a list item for each of the diseases selected by the user
                    item.classList.add("w-full")
                    item.innerHTML = selection[i].label //allows us to display the name of the disease
                    item.append(button) // adds the button to the list element
            $('#diseaseList').prepend(item) // adds the list element to the list
            const meds = await fetchMeds(selection[i])// passes on the selected diseases and initiates the query to fetch their medicines
            disandmeds.push(meds)
        } 
    fetchInteractions(disandmeds)
    })

//_______________________________________________________________________________________________________________//
async function fetchMeds(selection)
{
     //clears out the container before the function is ran (incase is is ran multiple times)
    var medication = [] //clears out the list of medication before the function is ran (incase is is ran multiple times)
        const code = selection.value.slice(31) // leaves only the wikidata code of that object 
        const itemize = document.createElement('ul'); //creates an element "unordered list"
                itemize.classList.add("list-disc") // uses tailwind to add the bulletpoints to the list
        const container = document.createElement('div') // creates a "div" element
                container.innerHTML = selection.label // adds the text corresponding to the selected medication 
                container.append(itemize) // adds the unordered list to the container
                container.classList.add("my-2") //uses tailwind to add a 2 pt y margin to the container
                container.classList.add("font-bold") //uses tailwind to make the text in the container bold
        
        const meds = await medicationQuery(code)
        var medlist = []
        for (var j = 0, m = meds.length; j < m; j++)
        {
            medlist.push([meds[j].medicine.value.slice(31), meds[j].medicineLabel.value]) //adds the medication to the list, once again the slice makes sure we only get the item code
            const item = document.createElement('li') // creates a new element "list item"
            item.innerHTML = meds[j].medicineLabel.value //adds text to the list item matching the name of the medicine
            item.classList.add("font-light") // uses tailwind to make the font of the list items bbe light
            item.classList.add("ml-5") // uses tailwind to add a 5pt margin to the left of each list item (creates an indent)
                    itemize.append(item) //adds the list item to the list 
        }
    medication.push([code, selection.label, medlist]) //adds the code and name of a disease and all the medications that treat it
    
$('#div').append(container)
    return medication
}


async function loadDropdown() {
    const dropdown = document.getElementById("dropdown") //tells javascript that whenever we refer to "dropdown"
    // we are refering to the html element with the id "dropdown"
    const list = await diseasesQuery() //fetches the diseases by running the function from the queries.js
    for (var i = 0, l = list.length; i < l; i++) {
        const option = document.createElement('option') //for each element in the list
        // a new 'option' is created in the form
        option.text = list[i].diseaseLabel.value; // attaches the name of the disease to the option
        option.label = list[i].diseaseLabel.value;
        option.value = list[i].disease.value; //attaches the wikidata code to the option so it can 
        //be passed on later
        dropdown.add(option) // adds newly created option to the <select> </select> element in the html
    }
    $(function () { // function to alphabetically sort the diseases
        var select = $('#dropdown');
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
    $("#submit").on("click", function () { //adds event listener in the button in the html file with the id "submit"
        var selection = [] //clears the list before (in case the function is ran multiple times)
        var selection = $("select option:selected") // assigns all the selected options to the variable selection
        $('ul').empty() // clears the list element before running the rest of the function (in case the function is ran multiple times)
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

            $('ul').prepend(item) // adds the list element to the list
        }
        fetchMeds(selection) // passes on the selected diseases and initiates the query to fetch their medicines
    })
//_______________________________________________________________________________________________________________//
async function fetchMeds(selection)
{
    $('#div').empty() //clears out the container before the function is ran (incase is is ran multiple times)
    var medication = [] //clears out the list of medication before the function is ran (incase is is ran multiple times)
    const choice = selection;
    for (var i = 0, l = choice.length; i < l; i++)
    {
        const code = choice[i].value.slice(31)
        const itemize = document.createElement('ul');
        itemize.classList.add("list-disc")
        
        
        const container = document.createElement('div')
                container.innerHTML = choice[i].label
        container.append(itemize)
        container.classList.add("my-2")
        container.classList.add("font-bold")
        const list = await medicationQuery(code)
        var medlist = []

        for (var j = 0, m = list.length; j < m; j++)
        {
            medlist.push(list[j].medicine.value.slice(31))

            const item = document.createElement('li')
            item.innerHTML = list[j].medicineLabel.value
            item.classList.add("font-light")
            item.classList.add("ml-5")
                    itemize.append(item)
        }
        medication.push([choice[i].label, medlist])
        $('#div').append(container)
    }

    for (k = 0, n = selection.length; k < n; k++)
    {
        var arrA = medication[k][1]
        for (o = 0, p = selection.length; o < p && o != k; o++)
        {
            var arrB = medication[o][1]
            var comb = "overlap " + medication[k][0] + medication[o][0]
            overlap(comb, arrA, arrB)
        }
    }
}


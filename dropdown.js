async function loadDropdown() {
    const dropdown = document.getElementById("dropdown")
    const list = await diseasesQuery()
    for (var i = 0, l = list.length; i < l; i++) {
      const option = document.createElement('option')
      option.text =  list[i].diseaseLabel.value;
      option.label =  list[i].diseaseLabel.value;
      option.value = list[i].disease.value;
      dropdown.add(option)
    }
    $(function () {
      var select = $('#dropdown');
      select.html(select.find('option')
          .sort(function (x, y) {
              return $(x).text()
                  > $(y).text() ? 1 : -1;
          }))
  })
}
loadDropdown()
//________________________________________________________________________________________________//

$("#submit").on("click", function () {
    var selection = []
    var selection = $("select option:selected")
    $('ul').empty()
    for (var i = 0, l = selection.length; i < l; i++){
        console.log(selection[i].label)
    
        const button = document.createElement('button') //creates a button element for each of the selected diseases
            button.innerHTML = "&times"
            button.value = selection[i].value.slice(31)
        
        const item = document.createElement('li')
            item.innerHTML = selection[i].label
            item.append(button) 

        $('ul').prepend(item)
    }
    fetchMeds(selection)
}
)

// $(" select ").on("change", function (){
//    //clears the list 
//     var selection = [] //clears the previous selection

//     $("select option:selected").each(function (){ //selects only the elements in the dropdown which are selected, the function is performed for each one seperately
//         $('ul').empty()
//         console.log($(option).text())
//         selection.push([this.value.slice(31), $(this).text()]) //adds the code of each of the selected options to the list
        
//         const button = document.createElement('button') //creates a button element for each of the selected diseases
//             button.innerHTML = "&times"
//             button.value = this.value.slice(31)
        
//         const item = document.createElement('li')
//             item.innerHTML = $(this).text()
//             item.append(button) 

//         $('ul').prepend(item)
//     }
//     )
    
//     fetchMeds(selection)
// }).trigger("change")

//_______________________________________________________________________________________________________________//
async function fetchMeds(selection) {
    $('#div').empty()
    var medication = []
    const choice = selection;
    for(var i = 0, l = choice.length; i < l; i++){
        const code = choice[i].value.slice(31)

        const itemize = document.createElement('ul');
        const container = document.createElement('div')
                container.innerHTML = choice[i].label
                container.append(itemize)
        const list = await medicationQuery(code)
        var medlist = []
            for (var j = 0, m = list.length; j < m; j++) {
                medlist.push(list[j].medicine.value.slice(31))

                const item = document.createElement('li')
                item.innerHTML = list[j].medicineLabel.value
                itemize.append(item)
        }
        medication.push([choice[i].label, medlist])
        $('#div').append(container)
    }
    console.log(medication)
    if (selection.length > 1) {
        checkInteraction(medication)
    } else pass
}


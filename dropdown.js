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

$(" select ").on("change", function (){
    $('ul').empty() //clears the list 
    const selection = [] //clears the previous selection

    $("select option:selected").each(function (){ //selects only the elements in the dropdown which are selected, the function is performed for each one seperately
        selection.push(this.value.slice(31)) //adds the code of each of the selected options to the list
        
        const button = document.createElement('button') //creates a button element for each of the selected diseases
            button.innerHTML = "&times"
            button.value = this.value.slice(31)
        

        var item = document.createElement('li')
            item.innerHTML = $(this).text()
            item.append(button)

        $('ul').prepend(item)
    }) 
    console.log(selection)
    addToList(selection)
}).trigger("change")
//_______________________________________________________________________________________________________________//
async function addToList(choice) {
    const disease = choice;
    const list = await interactionQuery(disease)
    console.log(list)
}
addToList()


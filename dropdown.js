async function loadDropdown() {
    const dropdown = document.getElementById("dropdown")
    const list = await diseasesQuery()
    for (var i = 0, l = list.length; i < l; i++) {
      const option = document.createElement('option')
      option.text = list[i].diseaseLabel.value;
      option.value = list[i].disease.value;
      dropdown.add(option)
    }
    $(function () {
      var select = $('select');
      select.html(select.find('option')
          .sort(function (x, y) {
              return $(x).text()
                  > $(y).text() ? 1 : -1;
          }))
  })
}
loadDropdown()
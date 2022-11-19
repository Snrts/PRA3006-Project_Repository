class SPARQLQueryDispatcher {
  constructor( endpoint ) {
      this.endpoint = endpoint;
  }
  query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };
      return fetch( fullUrl , { headers } ).then( body => body.json());
  }
}
// const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
// Setting up an endpoint to the wikidata database 
//_________________________________________________________________________________________________________________//
async function runQuery(query) {
  const endpointUrl = 'https://query.wikidata.org/sparql';
  let queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
  let response = await queryDispatcher.query(query);
  console.log(response)
  return response
  
}
// Defines a function into which we can input and run a query
//_________________________________________________________________________________________________________________//
async function loadDropdown() {
  const dropdown = document.getElementById("dropdown")
  const list = await diseasesQuery()
  for (var i = 0, l = list.length; i < l; i++) {
    const option = document.createElement('option')
    option.text = list[i].diseaseLabel.value;
    option.value = list[i].disease.value;
    dropdown.add(option)
  }
}

async function diseasesQuery() { //asynchronous function to fetch diseases
  const query = `SELECT DISTINCT ?disease ?diseaseLabel ?typeLabel 
  WHERE {
    {
      VALUES ?item {wd:Q12135} #all entries of "mental disorder
            ?type wdt:P279 ?item . #"categories" of mental disorders, subclasses of mental disorders 
            ?disease wdt:P279 ?type . #the mental disorders which fall into that category
    }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
  }` // Defines query
  try {
    const result = await runQuery(query); //runs the function "runQuery()" with the previous query as input, then waits for that to be finished
    const output = Object.entries(result)[1][1]
    const need = Object.values(output)[0]
    const diseases = []
    for (var i = 0, l = need.length; i < l; i++){
      const condition = need[i];
      diseases.push(condition)
    }
    return diseases
  } catch (error) {
    alert(error) // if the query can not be succesfully finished it gives an error in the browser.
  }
}
loadDropdown()
//_________________________________________________________________________________________________________________________________________//
// function addChoice(form) {
  //   const output = form.inputbox.value
  //   let choice = output.slice(31);
  //   alert("you chose" + choice);
  //   interactionQuery(choice)
  // }
  async function interactionQuery() {
    // console.log(selected)
    // const queryint = `SELECT DISTINCT ?medicine ?medicineLabel ?type ?typeLabel ?interactswithLabel ?treatsLabel 
    // WHERE {
    //   {
    //       VALUES ?item {wd:Q12140} #selects all entries that are medicines
    //         ?medicine wdt:P279 ?item ; #?medicine is a subclass of those entries
    //              wdt:P2175 wd: #which is selected only if the medical condition treated is Attention deficit Hyperactivity disorder
    //              wdt:P769 ?interactswith . #Significant drug interactions of that medicine
    //         ?type wdt:P31 ?medicine . #Instances of that medication
    //         ?interactswith wdt:P2175 ?treats . #? is the medical condition treated by the medicine that the drug interacts with 
    //         ?treats wdt:P31 wd:Q12135 . #where ?treats is an instance of mental disorder
    //   }
    //   SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
    // }`  
    
  try {
      const result = await runQuery(queryint)
      console.log(result)
  } catch (error) {
      alert(error) // if the query can not be succesfully finished it gives an error in the browser.
    }
}
interactionQuery()
//_________________________________________________________________________________________________________________//

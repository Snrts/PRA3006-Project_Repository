class SPARQLQueryDispatcher {
  constructor( endpoint ) {
      this.endpoint = endpoint;
  }
  query( sparqlQuery ) {
      const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };
      return fetch( fullUrl , { headers } ).then( body => body.json() );
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
async function diseasesQuery() { //asynchronous function to fetch diseases
  // diseases = []
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
    // console.table(need)
    // console.log(need[1].disease)
    document.getElementById("results").innerHTML = need[1].diseaseLabel.value
  } catch (error) {
    alert(error) // if the query can not be succesfully finished it gives an error in the browser.
  }
}
diseasesQuery()
// Query to fetch the mental diseases from the SPARQL endpoint of wikidata
//_________________________________________________________________________________________________________________//
async function interactionQuery(selected) {
  const query = `SELECT DISTINCT ?medicine ?medicineLabel ?type ?typeLabel ?interactswithLabel ?treatsLabel 
  WHERE {
    {
        VALUES ?item {wd:Q12140} #selects all entries that are medicines
          ?medicine wdt:P279 ?item ; #?medicine is a subclass of those entries
               wdt:P2175 wd:Q181923 ; #which is selected only if the medical condition treated is Attention deficit Hyperactivity disorder
               wdt:P769 ?interactswith . #Significant drug interactions of that medicine
          ?type wdt:P31 ?medicine . #Instances of that medication
          ?interactswith wdt:P2175 ?treats . #? is the medical condition treated by the medicine that the drug interacts with 
          ?treats wdt:P31 wd:Q12135 . #where ?treats is an instance of mental disorder
    }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
  }`
  try {
    this.interaction = await runQuery(query)
  } catch (error) {
    alert(error)
  }
}



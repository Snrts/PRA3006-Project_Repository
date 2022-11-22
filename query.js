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
  // console.table(response)
  return response
}
// Defines a function into which we can input and run a query
//_________________________________________________________________________________________________________________//
async function diseasesQuery() { //asynchronous function to fetch diseases
  const query = `SELECT DISTINCT ?disease ?diseaseLabel
  WHERE {
    {
      VALUES ?item {wd:Q112193867} #all entries of "mental disorder
            ?disease wdt:P31 ?item ;
                     wdt:P1995 wd:Q7867 ;
                     wdt:P2176 ?treatment .
      }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
  }` // Defines query
  try { //if the query is succesfull the following will run
    const result = await runQuery(query); //runs the function "runQuery()" with the previous query as input, then waits for that to be finished
    const diseases = Object.values(Object.entries(result)[1][1])[0] //turns the "result" Object into an Array
    return diseases
  } catch (error) {
    alert(error) // if the query can not be succesfully finished it gives an error in the browser.
  }
}

//_________________________________________________________________________________________________________________________________________//
async function medicationQuery(input) {
    const start = `SELECT DISTINCT ?medicine ?medicineLabel ?interactswithLabel ?treatsLabel 
    WHERE {
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
      {
          VALUES ?item {wd:variable} 
    ?item wdt:P2176 ?medicine;
    }}`
  const querymeds = start.replace('variable', input) //in order to run the query based on the input of the user we split it into 3
  // and then piece the query together before we insert it into the runQuery() function
  try { //if the query is succesfull the following will run
    const result = await runQuery(querymeds)
    const medication = Object.values(Object.entries(result)[1][1])[0] //turns the "result" Object into an Array
    return medication
  } catch (error) {
      alert(error) // if the query can not be succesfully finished it gives an error in the browser.
    }
}

//________________________________________________________________________________________________________________________________________//
async function fetchInteractions(medicine) {
  // const diseaseA = "Q202387"
  // const diseaseB = "Q181923" 
  const querytemplate = `SELECT DISTINCT  ?interactswith ?interactswithLabel
  WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
    {
        wd:MED wdt:P769 ?interactswith .
      } UNION {
       ?interactswith wdt:P769 wd:MED .
      }
      ?interactswith wdt:P2175 ?treats .
      ?treats  wdt:P31 wd:Q112193867 ;
                     wdt:P1995 wd:Q7867 .
  }`
  const queryint = querytemplate.replaceAll("MED", medicine)
  try { //if the query is succesfull the following will run
    const result = await runQuery(queryint)
    const medication = Object.values(Object.entries(result)[1][1])[0] //turns the "result" Object into an Array
    const output = []
    // console.log(medication)
    for (var a = 0, b = medication.length; a < b; a++){

    }
    return medication
  } catch (error) {
      alert(error) // if the query can not be succesfully finished it gives an error in the browser.
    }

}
// fetchInteractions("Q181923", "Q202387")
//_________________________________________________________________________________________________________________//

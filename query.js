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
//_________________________________________________________________________________________________________________________________________//
  async function interactionQuery(input) {
    const start = `SELECT DISTINCT ?medicine ?medicineLabel ?type ?typeLabel ?interactswithLabel ?treatsLabel 
WHERE {
  {
      VALUES ?item {wd:Q12140}
        ?medicine wdt:P279 ?item ; 
             wdt:P2175 wd:`
const val = input
const end = `; wdt:P769 ?interactswith . 
?type wdt:P31 ?medicine . 
?interactswith wdt:P2175 ?treats . 
?treats wdt:P31 wd:Q12135 . 
}
SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
}`
const queryint = start + val  + end
  try {
    const result = await runQuery(queryint)
    const output = Object.entries(result)[1][1]
    const need = Object.values(output)[0]

    const medication = []
    for (var i = 0, l = need.length; i < l; i++){
      const condition = need[i];
      medication.push(condition)
    }
    return medication
  } catch (error) {
      alert(error) // if the query can not be succesfully finished it gives an error in the browser.
    }
}

//________________________________________________________________________________________________________________________________________//
//   async function interactionQuery() {
//     const start = `SELECT DISTINCT ?medicine ?medicineLabel ?type ?typeLabel ?interactswithLabel ?treatsLabel 
// WHERE {
//   {
//       VALUES ?item {wd:Q12140}
//         ?medicine wdt:P279 ?item ; 
//              wdt:P2175 wd:`
// const val = "Q181923"
// const end = `; wdt:P769 ?interactswith . 
// ?type wdt:P31 ?medicine . 
// ?interactswith wdt:P2175 ?treats . 
// ?treats wdt:P31 wd:Q12135 . 
// }
// SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". }
// }`
// const queryint = start + val  + end
//   try {
//     const result = await runQuery(queryint)
//     const output = Object.entries(result)[1][1]
//     const need = Object.values(output)[0]
//       console.table(need)
//   } catch (error) {
//       alert(error) // if the query can not be succesfully finished it gives an error in the browser.
//     }
// }
// interactionQuery()
//_________________________________________________________________________________________________________________//
